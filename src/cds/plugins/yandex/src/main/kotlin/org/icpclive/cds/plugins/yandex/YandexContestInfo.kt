package org.icpclive.cds.plugins.yandex

import kotlinx.datetime.Instant
import org.icpclive.cds.api.*
import org.icpclive.cds.plugins.yandex.api.*
import org.icpclive.cds.plugins.yandex.api.Participant
import org.icpclive.cds.plugins.yandex.api.Problem
import kotlin.time.Duration.Companion.seconds

private fun Problem.toApi(index: Int, resultType: ContestResultType) = ProblemInfo(
    id = id,
    displayName = alias,
    fullName = name,
    ordinal = index,
    minScore = if (resultType == ContestResultType.IOI) 0.0 else null,
    maxScore = if (resultType == ContestResultType.IOI) 100.0 else null,
    scoreMergeMode = if (resultType == ContestResultType.IOI) ScoreMergeMode.MAX_TOTAL else null
)

internal class YandexContestInfo(
    contestDescription: ContestDescription,
    problems: List<Problem>,
    participants: List<Participant>,
    private val resultType: ContestResultType,
) {

    private val name = contestDescription.name
    private val startTime = Instant.parse(contestDescription.startTime)
    private val duration = contestDescription.duration.seconds
    private val freezeTime = (contestDescription.freezeTime ?: contestDescription.duration).seconds
    private val problems = problems.mapIndexed { index, it -> it.toApi(index, resultType) }
    private val teams =  participants.map { it.toTeamInfo() }.sortedBy { it.id }
    private val teamIds = teams.map(TeamInfo::id).toSet()
    private val testCountByProblem = problems.map { it.id to it.testCount }.toMap()



    fun submissionToRun(submission: Submission): RunInfo {
        val testCount = testCountByProblem[submission.problemId]

        val verdict = getResult(submission.verdict)
        val result = if (verdict != null) {
            when (resultType) {
                ContestResultType.ICPC -> verdict.toICPCRunResult()
                ContestResultType.IOI -> RunResult.IOI(
                    score = listOf(submission.score ?: 0.0),
                )
            }
        } else {
            RunResult.InProgress(
                when {
                    testCount == null || testCount == 0 -> 0.0
                    submission.test == -1L -> 0.0
                    submission.test >= testCount -> 100.0
                    else -> submission.test.toDouble() / testCount
                }
            )
        }
        return RunInfo(
            id = submission.id.toInt(),
            result = result,
            problemId = submission.problemId,
            teamId = submission.authorId.toInt(),
            time = submission.timeFromStart,
        )
    }

    fun isTeamSubmission(submission: Submission): Boolean {
        return submission.authorId.toInt() in teamIds
    }

    fun toApi() = ContestInfo(
        name = name,
        status = ContestStatus.byCurrentTime(startTime, duration),
        resultType = resultType,
        startTime = startTime,
        contestLength = duration,
        freezeTime = freezeTime,
        problemList = problems,
        teamList = teams,
        groupList = emptyList(),
        organizationList = emptyList(),
        penaltyRoundingMode = PenaltyRoundingMode.SUM_DOWN_TO_MINUTE
    )
}

