package fr.gouv.cacem.monitorenv.infrastructure.monitorfish.adapters

import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MonitorFishActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity
import kotlinx.serialization.Serializable

@Serializable
data class MonitorFishMissionActionDataInput(
    val id: Int,
    val actionDatetimeUtc: String,
    val actionType: MonitorFishActionTypeEnum,
    val completion: ActionCompletionEnum,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val missionId: Int,
    val numberOfVesselsFlownOver: Int? = null,
    val otherComments: String? = null,
    val vesselName: String? = null,
) {
    fun toMonitorFishMissionActionEntity(): MonitorFishMissionActionEntity =
        MonitorFishMissionActionEntity(
            id = this.id,
            actionDatetimeUtc = this.actionDatetimeUtc,
            actionType = this.actionType,
            completion = this.completion,
            latitude = this.latitude,
            longitude = this.longitude,
            missionId = this.missionId,
            numberOfVesselsFlownOver = this.numberOfVesselsFlownOver,
            otherComments = this.otherComments,
            vesselName = this.vesselName,
        )
}
