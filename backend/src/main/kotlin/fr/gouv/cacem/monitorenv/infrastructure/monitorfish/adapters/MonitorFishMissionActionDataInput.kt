package fr.gouv.cacem.monitorenv.infrastructure.monitorfish.adapters

import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity
import kotlinx.serialization.Serializable

@Serializable
data class MonitorFishMissionActionDataInput(
    val id: Int,
    val missionId: Int,
) {
    fun toMonitorFishMissionActionEntity(): MonitorFishMissionActionEntity {
        return MonitorFishMissionActionEntity(
            id = this.id,
            missionId = this.missionId,
        )
    }
}
