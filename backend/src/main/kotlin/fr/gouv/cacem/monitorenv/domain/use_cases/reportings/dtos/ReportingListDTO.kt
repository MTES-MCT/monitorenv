package fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ControlStatusEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity

data class ReportingListDTO(
    val reporting: ReportingEntity,
    val reportingSources: List<ReportingSourceDTO>,
    val attachedMission: MissionEntity? = null,
) {
    val controlStatus: ControlStatusEnum?
        get() = getControlStatus(reporting, attachedMission)
}
