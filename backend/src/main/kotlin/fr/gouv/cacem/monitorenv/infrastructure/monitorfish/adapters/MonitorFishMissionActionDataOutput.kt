package fr.gouv.cacem.monitorenv.infrastructure.monitorfish.adapters

import fr.gouv.cacem.monitorenv.domain.entities.mission.MonitorFishActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity

data class MonitorFishMissionActionDataOutput(
    val id: Int,
    val actionDatetimeUtc: String,
    val actionType: MonitorFishActionTypeEnum,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val missionId: Int,
    val numberOfVesselsFlownOver: Int? = null,
    val otherComments: String? = null,
    val vesselName: String? = null,
) {

    companion object {
        fun fromMonitorFishMissionActionEntity(
            monitorFishMissionActionEntity: MonitorFishMissionActionEntity,
        ) =
            MonitorFishMissionActionDataOutput(
                id = monitorFishMissionActionEntity.id,
                actionDatetimeUtc = monitorFishMissionActionEntity.actionDatetimeUtc,
                actionType = monitorFishMissionActionEntity.actionType,
                latitude = monitorFishMissionActionEntity.latitude,
                longitude = monitorFishMissionActionEntity.longitude,
                missionId = monitorFishMissionActionEntity.missionId,
                numberOfVesselsFlownOver =
                monitorFishMissionActionEntity.numberOfVesselsFlownOver,
                otherComments = monitorFishMissionActionEntity.otherComments,
                vesselName = monitorFishMissionActionEntity.vesselName,
            )
    }
}
