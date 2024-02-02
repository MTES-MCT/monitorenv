package fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish

import kotlinx.serialization.Serializable

@Serializable
data class MonitorFishMissionActionEntity(
    val id: Int? = null,
    val missionId: Int,
)
