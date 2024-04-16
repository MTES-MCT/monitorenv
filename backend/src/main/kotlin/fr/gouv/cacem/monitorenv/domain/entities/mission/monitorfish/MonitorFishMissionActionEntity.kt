package fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish

import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MonitorFishActionTypeEnum

data class MonitorFishMissionActionEntity(
    val id: Int,
    val actionDatetimeUtc: String,
    val actionType: MonitorFishActionTypeEnum,
    val completion: ActionCompletionEnum,
    val missionId: Int,
    val numberOfVesselsFlownOver: Int?,
    val vesselName: String? = null,
    val latitude: Double? = null,
    val longitude: Double? = null,
    val otherComments: String? = null,
)
