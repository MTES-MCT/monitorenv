package fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO

data class ReportingDTO(
    val reporting: ReportingEntity,
    val semaphore: SemaphoreEntity? = null,
    val controlUnit: FullControlUnitDTO? = null,
    val attachedMission: MissionEntity? = null,
)
