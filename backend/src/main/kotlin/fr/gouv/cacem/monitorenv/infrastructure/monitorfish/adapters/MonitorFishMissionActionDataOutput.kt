package fr.gouv.cacem.monitorenv.infrastructure.monitorfish.adapters

import fr.gouv.cacem.monitorenv.domain.entities.mission.MonitorFishActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity

data class MonitorFishMissionActionDataOutput(
    val id: Int,
    val actionDatetimeUtc: String,
    val actionType: MonitorFishActionTypeEnum,
    val missionId: Int,
    val numberOfVesselsFlownOver: Int? = null,
    val vesselName: String? = null,
) {

    companion object {
        fun fromMonitorFishMissionActionEntity(
            monitorFishMissionActionEntity: MonitorFishMissionActionEntity,
        ) =
            MonitorFishMissionActionDataOutput(
                id = monitorFishMissionActionEntity.id,
                missionId = monitorFishMissionActionEntity.missionId,
                actionType = monitorFishMissionActionEntity.actionType,
                vesselName = monitorFishMissionActionEntity.vesselName,
                actionDatetimeUtc = monitorFishMissionActionEntity.actionDatetimeUtc,
                numberOfVesselsFlownOver =
                monitorFishMissionActionEntity.numberOfVesselsFlownOver,
            )
    }
}
