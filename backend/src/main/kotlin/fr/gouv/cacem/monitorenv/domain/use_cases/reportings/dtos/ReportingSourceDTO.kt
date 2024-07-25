package fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingSourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO

data class ReportingSourceDTO(
    val reportingSource: ReportingSourceEntity,
    val semaphore: SemaphoreEntity?,
    val controlUnit: FullControlUnitDTO?,
)
