package org.icpclive.data

import org.icpclive.config
import org.icpclive.api.*
import org.icpclive.widget.PresetsController
import org.icpclive.widget.SimpleController
import org.icpclive.widget.SvgTransformer

object WidgetControllers {
    private val WidgetManager = WidgetManager()
    private val TickerManager = TickerManager()
    val queue = SimpleController(QueueSettings(), WidgetManager, ::QueueWidget)
    val statistics = SimpleController(StatisticsSettings(), WidgetManager, ::StatisticsWidget)
    val ticker = SimpleController(TickerSettings(), WidgetManager, ::TickerWidget)
    val scoreboard = SimpleController(ScoreboardSettings(), WidgetManager, ::ScoreboardWidget)
    val teamView = SimpleController(TeamViewSettings(), WidgetManager, ::TeamViewWidget)
    val teamPVP = SimpleController(TeamPVPSettings(), WidgetManager, ::TeamPVPWidget)
    val splitScreen = TeamViewPosition.values().associateBy(
        { it.ordinal.toString() },
        { position -> SimpleController(TeamViewSettings(), WidgetManager) { TeamViewWidget(it, position) } }
    )
    val locator = SimpleController(TeamLocatorSettings(), WidgetManager, ::TeamLocatorWidget)

    private fun presetsPath(name: String) = config.presetsDirectory.resolve("$name.json")

    val advertisement = PresetsController(presetsPath("advertisements"), WidgetManager, ::AdvertisementWidget)
    val picture = PresetsController(presetsPath("pictures"), WidgetManager, ::PictureWidget)
    val title = PresetsController(presetsPath("title"), WidgetManager) { titleSettings: TitleSettings ->
        SvgWidget(
            SvgTransformer(config.mediaDirectory, titleSettings.preset, titleSettings.data).toBase64()
        )
    }
    val tickerMessage = PresetsController(presetsPath("ticker"), TickerManager, TickerMessageSettings::toMessage)
}
