package org.icpclive.cds.plugins.yandex.api

import kotlinx.serialization.Serializable
import org.icpclive.cds.api.TeamId
import org.icpclive.cds.api.TeamInfo

@Serializable
internal data class Participant(
    val id: Int,
    val name: String,
    val login: String,
    val uid: String?,
) {
    fun toTeamInfo() = TeamInfo(
        id = TeamId(login),
        fullName = name,
        displayName = name,
        groups = emptyList(),
        hashTag = null,
        medias = emptyMap(),
        isOutOfContest = false,
        isHidden = false,
        organizationId = null
    )
}
