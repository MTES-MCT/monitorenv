package fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import java.util.*

data class MissionDetailsDTO(
    val mission: MissionEntity,
    val fishActions: List<MonitorFishMissionActionEntity>? = listOf(),
    val attachedReportings: List<ReportingDetailsDTO>? = listOf(),
    val attachedReportingIds: List<Int>? = listOf(),
    val detachedReportings: List<ReportingEntity>? = listOf(),
    val detachedReportingIds: List<Int>? = listOf(),
    val envActionsAttachedToReportingIds: List<EnvActionAttachedToReportingIds>? = listOf(),
    val hasRapportNavActions: RapportNavMissionActionEntity? = null,
)

typealias EnvActionAttachedToReportingIds = Pair<UUID, List<Int>>
