package org.icpclive.service

import kotlinx.coroutines.*
import kotlinx.coroutines.flow.*
import org.icpclive.Config
import org.icpclive.api.CurrentTeamState
import org.icpclive.cds.ContestUpdate
import org.icpclive.cds.api.OptimismLevel
import org.icpclive.cds.scoreboard.calculateScoreboard
import org.icpclive.data.DataBus
import org.icpclive.service.analytics.AnalyticsGenerator
import org.icpclive.util.completeOrThrow
import org.slf4j.Logger

fun CoroutineScope.launchServices(logger: Logger, loader: Flow<ContestUpdate>) {
    val started = MutableStateFlow(1)
    val starter = SharingStarted {
        started
            .filter { it == 0 }
            .map { SharingCommand.START }
            .onEach { logger.info("Start loading data") }
            .take(1)
    }
    val normalScoreboardState = loader
        .calculateScoreboard(OptimismLevel.NORMAL)
        .shareIn(this, starter)

    fun CoroutineScope.launchService(service: Service) = launch {
        started.update { it + 1 }
        var subscribed = false
        launch(CoroutineName(service::class.simpleName!!)) {
            with(service) {
                runOn(normalScoreboardState.onSubscription {
                    logger.info("Service ${service::class.simpleName} subscribed to cds data")
                    require(!subscribed) { "Service ${service::class.simpleName} shouldn't subscribe twice" }
                    subscribed = true
                    started.update { it - 1 }
                })
            }
        }
    }

    val teamInterestingFlow = MutableStateFlow(emptyList<CurrentTeamState>())
    DataBus.teamInterestingFlow.completeOrThrow(teamInterestingFlow)

    launchService(ContestStateService())
    launchService(QueueService())
    launchService(ScoreboardService())
    launchService(StatisticsService())
    launchService(AnalyticsService(AnalyticsGenerator(Config.analyticsTemplatesFile)))
    launchService(ExternalRunsService())
    launchService(TeamSpotlightService(teamInteresting = teamInterestingFlow))
    launchService(RegularLoggingService())
    started.update { it - 1 }
}
