package org.icpclive.cds.pcms

import guessDatetimeFormat
import humanReadable
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.channels.BufferOverflow
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.datetime.*
import org.icpclive.Config.loadFile
import org.icpclive.Config.loadProperties
import org.icpclive.DataBus
import org.icpclive.api.ContestStatus
import org.icpclive.api.RunInfo
import org.icpclive.cds.EventsLoader
import org.icpclive.cds.ProblemInfo
import org.icpclive.service.*
import org.jsoup.Jsoup
import org.jsoup.nodes.Document
import org.jsoup.nodes.Element
import org.jsoup.parser.Parser
import org.slf4j.LoggerFactory
import java.awt.Color
import java.util.*
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.Duration.Companion.seconds

class PCMSEventsLoader : EventsLoader() {
    private fun loadProblemsInfo(problemsFile: String?) : List<ProblemInfo> {
        val xml = loadFile(problemsFile!!)
        val doc = Jsoup.parse(xml, "", Parser.xmlParser())
        val problems = doc.child(0)
        return problems.children().map { element ->
            ProblemInfo(
                element.attr("alias"),
                element.attr("name"),
                if (element.attr("color").isEmpty()) Color.BLACK else Color.decode(element.attr("color"))
            )
        }
    }


    override suspend fun run() {
        coroutineScope {
            val rawRunsFlow = MutableSharedFlow<RunInfo>(
                extraBufferCapacity = 100000,
                onBufferOverflow = BufferOverflow.SUSPEND
            )
            launchICPCServices(contestData.problemsNumber, rawRunsFlow)

            val xmlLoader = object : RegularLoaderService<Document>() {
                override val url = properties.getProperty("url")
                override val login = properties.getProperty("login")
                override val password = properties.getProperty("password")
                override fun processLoaded(data: String) = Jsoup.parse(data, "", Parser.xmlParser())
            }

            val emulationSpeedProp : String? = properties.getProperty("emulation.speed")
            if (emulationSpeedProp == null) {
                val xmlLoaderFlow = MutableStateFlow(Document(""))
                launch(Dispatchers.IO) {
                    xmlLoader.run(xmlLoaderFlow, 5.seconds)
                }
                xmlLoaderFlow.collect {
                    parseAndUpdateStandings(it) { runBlocking { rawRunsFlow.emit(it) } }
                    DataBus.contestInfoFlow.value = contestData.toApi()
                    if (contestData.status == ContestStatus.RUNNING) {
                        logger.info("Updated for contest time = ${contestData.contestTime}")
                    }
                }
            } else {
                val runs = mutableListOf<RunInfo>()
                parseAndUpdateStandings(xmlLoader.loadOnce()) { runs.add(it) }
                if (contestData.status != ContestStatus.OVER) {
                    throw IllegalStateException("Emulation mode require over contest")
                }
                val emulationSpeed = emulationSpeedProp.toDouble()
                val emulationStartTime = guessDatetimeFormat(properties.getProperty("emulation.startTime"))
                logger.info("Running in emulation mode with speed x${emulationSpeed} and startTime = ${emulationStartTime.humanReadable}")
                launch {
                    EmulationService(
                        emulationStartTime,
                        emulationSpeed,
                        runs.toList(),
                        contestData.toApi(),
                        rawRunsFlow
                    ).run()
                }
            }

        }
    }

    private fun parseAndUpdateStandings(element: Element, onRunChanges: (RunInfo) -> Unit) {
        if ("contest" == element.tagName()) {
            parseContestInfo(element, onRunChanges)
        } else {
            element.children().forEach { parseAndUpdateStandings(it, onRunChanges) }
        }
    }

    private var lastRunId = 0
    private fun parseContestInfo(element: Element, onRunChanges: (RunInfo) -> Unit) {
        val status = ContestStatus.valueOf(element.attr("status").uppercase(Locale.getDefault()))
        val contestTime = element.attr("time").toLong().milliseconds
        if (status == ContestStatus.RUNNING && contestData.status !== ContestStatus.RUNNING) {
            contestData.startTime = Clock.System.now() - contestTime
        }
        contestData.status = status
        contestData.contestTime = contestTime
        element.children().forEach { session: Element ->
            if ("session" == session.tagName()) {
                parseTeamInfo(contestData, session, onRunChanges)
            }
        }
    }

    private fun parseTeamInfo(contestInfo: PCMSContestInfo, element: Element,onRunChanges: (RunInfo) -> Unit) {
        val alias = element.attr("alias")
        contestInfo.getParticipant(alias)?.apply {
            for (i in element.children().indices) {
                runs[i] = parseProblemRuns(contestInfo, element.child(i), i, id, onRunChanges)
            }
        }
    }

    private fun parseProblemRuns(contestInfo: PCMSContestInfo, element: Element, problemId: Int, teamId: Int, onRunChanges: (RunInfo) -> Unit): List<PCMSRunInfo> {
        if (contestInfo.status === ContestStatus.BEFORE) {
            return emptyList()
        }
        return element.children().mapIndexedNotNull { index, run ->
            parseRunInfo(contestInfo, run, problemId, teamId, index, onRunChanges)
        }
    }

    private fun parseRunInfo(contestInfo: PCMSContestInfo, element: Element, problemId: Int, teamId: Int, attemptId: Int, onRunChanges: (RunInfo) -> Unit): PCMSRunInfo? {
        val time = element.attr("time").toLong().milliseconds
        if (time > contestInfo.contestTime) return null
        val isFrozen = time >= contestInfo.freezeTime
        val oldRun = contestInfo.teams[teamId].runs[problemId].getOrNull(attemptId)
        val percentage = when {
            isFrozen -> 0.0
            "undefined" == element.attr("outcome") -> 0.0
            else -> 1.0
        }
        val isJudged = percentage >= 1.0
        val result = when {
            !isJudged -> ""
            "yes" == element.attr("accepted") -> "AC"
            else -> outcomeMap.getOrDefault(element.attr("outcome"), "WA")
        }
        val run = PCMSRunInfo(
            oldRun?.id ?: lastRunId++,
            isJudged, result, problemId, time.inWholeMilliseconds, teamId,
            percentage,
            if (isJudged == oldRun?.isJudged && result == oldRun.result)
                oldRun.lastUpdateTime
            else
                contestInfo.contestTime.inWholeMilliseconds
        )
        if (run.toApi() != oldRun?.toApi()) {
            onRunChanges(run.toApi())
        }
        return run
    }

    private var contestData: PCMSContestInfo
    private val properties: Properties = loadProperties("events")

    init {
        val problemInfo = loadProblemsInfo(properties.getProperty("problems.url"))
        val fn = properties.getProperty("teams.url")
        val xml = loadFile(fn)
        val doc = Jsoup.parse(xml, "", Parser.xmlParser())
        val participants = doc.child(0)
        val teams = participants.children().withIndex().map { (index, participant) ->
            val participantName = participant.attr("name")
            val alias = participant.attr("id")
            val hallId = participant.attr("hall_id").takeIf { it.isNotEmpty() } ?: alias
            val shortName = participant.attr("shortname")
                .split("(")[0]
                .let { if (it.length >= 30) it.substring(0..27) + "..." else it }
            val region = participant.attr("region").split(",")[0]
            val hashTag = participant.attr("hashtag")
            val groups = if (region.isEmpty()) emptySet() else mutableSetOf(region)
            PCMSTeamInfo(
                index, alias, hallId, participantName, shortName,
                hashTag, groups, problemInfo.size
            )
        }
        contestData = PCMSContestInfo(problemInfo, teams, Instant.fromEpochMilliseconds(0), ContestStatus.UNKNOWN)
        contestData.contestLength = properties.getProperty("contest.length", "" + 5 * 60 * 60 * 1000).toInt().milliseconds
        contestData.freezeTime = properties.getProperty("freeze.time", "" + 4 * 60 * 60 * 1000).toInt().milliseconds
        loadProblemsInfo(properties.getProperty("problems.url"))
    }

    companion object {
        private val logger = LoggerFactory.getLogger(PCMSEventsLoader::class.java)
        private val outcomeMap = mapOf(
            "undefined" to "UD",
            "fail" to "FL",
            "unknown" to "",
            "accepted" to "AC",
            "compilation-error" to "CE",
            "wrong-answer" to "WA",
            "presentation-error" to "PE",
            "runtime-error" to "RE",
            "time-limit-exceeded" to "TL",
            "memory-limit-exceeded" to "ML",
            "output-limit-exceeded" to "OL",
            "idleness-limit-exceeded" to "IL",
            "security-violation" to "SV",
        )
    }
}