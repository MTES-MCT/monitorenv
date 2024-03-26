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
    val latitude: Double? = null,
    val longitude: Double? = null,
) {
    fun toMonitorFishMissionActionEntity(): MonitorFishMissionActionEntity {
        return MonitorFishMissionActionEntity(
            id = this.id,
            actionDatetimeUtc = this.actionDatetimeUtc,
            actionType = this.actionType,
            latitude = this.latitude,
            longitude = this.longitude,
            missionId = this.missionId,
            numberOfVesselsFlownOver = this.numberOfVesselsFlownOver,
            vesselName = this.vesselName,
        )
    }
}
