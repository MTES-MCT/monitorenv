package fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import java.util.UUID

data class MissionDTO(
    val mission: MissionEntity,
    val fishActions: List<MonitorFishMissionActionEntity>? = listOf(),
    val attachedReportings: List<ReportingDTO>? = listOf(),
    val attachedReportingIds: List<Int>? = listOf(),
    val detachedReportings: List<ReportingDTO>? = listOf(),
    val detachedReportingIds: List<Int>? = listOf(),
    val envActionsAttachedToReportingIds: List<EnvActionAttachedToReportingIds>? = listOf(),
)

typealias EnvActionAttachedToReportingIds = Pair<UUID, List<Int>>
