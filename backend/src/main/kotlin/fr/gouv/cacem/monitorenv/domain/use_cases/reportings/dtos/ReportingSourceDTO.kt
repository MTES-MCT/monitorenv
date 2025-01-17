package fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingSourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity

data class ReportingSourceDTO(
    val reportingSource: ReportingSourceEntity,
    val semaphore: SemaphoreEntity?,
    val controlUnit: ControlUnitEntity?,
)
