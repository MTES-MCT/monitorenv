package fr.gouv.cacem.monitorenv.infrastructure.monitorfish.adapters

import fr.gouv.cacem.monitorenv.domain.entities.mission.MonitorFishActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity
import kotlinx.serialization.Serializable

@Serializable
data class MonitorFishMissionActionDataInput(
    val id: Int,
    val actionDatetimeUtc: String,
    val actionType: MonitorFishActionTypeEnum,
    val missionId: Int,
    val numberOfVesselsFlownOver: Int? = null,
    val vesselName: String? = null,
) {
    fun toMonitorFishMissionActionEntity(): MonitorFishMissionActionEntity {
        return MonitorFishMissionActionEntity(
            id = this.id,
            missionId = this.missionId,
            actionType = this.actionType,
            vesselName = this.vesselName,
            actionDatetimeUtc = this.actionDatetimeUtc,
            numberOfVesselsFlownOver = this.numberOfVesselsFlownOver,
        )
    }
}
