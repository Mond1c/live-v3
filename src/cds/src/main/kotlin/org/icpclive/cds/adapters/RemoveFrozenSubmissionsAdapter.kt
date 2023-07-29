package org.icpclive.cds.adapters

import kotlinx.coroutines.flow.*
import org.icpclive.cds.AnalyticsUpdate
import org.icpclive.cds.ContestUpdate
import org.icpclive.cds.InfoUpdate
import org.icpclive.cds.RunUpdate
import kotlin.time.Duration


fun Flow<ContestEventWithRunsBefore>.removeFrozenSubmissions() = transform {
    when (it.event) {
        is RunUpdate -> {
            if (it.infoBeforeEvent != null && it.event.newInfo.time >= it.infoBeforeEvent.freezeTime) {
                emit(RunUpdate(it.event.newInfo.copy(result = null)))
            } else {
                emit(it.event)
            }
        }
        is InfoUpdate -> {
            emit(it.event)
            if (it.event.newInfo.freezeTime != it.infoBeforeEvent?.freezeTime) {
                val newFreeze = it.event.newInfo.freezeTime
                val oldFreeze = it.infoBeforeEvent?.freezeTime ?: Duration.INFINITE
                it.runs.values.filter { run ->
                    (run.time < newFreeze) != (run.time < oldFreeze)
                }.forEach { run ->
                    emit(RunUpdate(if (run.time >= newFreeze) {
                        run.copy(result = null)
                    } else {
                        run
                    }))
                }
            }
        }
        is AnalyticsUpdate -> emit(it.event)
    }
}

@JvmName("RemoveFrozenSubmissions2")
fun Flow<ContestUpdate>.removeFrozenSubmissions() = withRunsBefore().removeFrozenSubmissions()