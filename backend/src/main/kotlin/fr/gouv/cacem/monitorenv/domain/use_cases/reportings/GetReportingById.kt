package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO

@UseCase
class GetReportingById(
    private val reportingRepository: IReportingRepository,
    private val controlUnitRepository: IControlUnitRepository,
    private val semaphoreRepository: ISemaphoreRepository,
) {
    fun execute(id: Int): Triple<ReportingEntity, FullControlUnitDTO?, SemaphoreEntity?> {
        val reporting = reportingRepository.findById(id)

        val fullControlUnit =
            if (reporting.controlUnitId != null) {
                controlUnitRepository.findById(reporting.controlUnitId)
            } else {
                null
            }
        val semaphore = if (reporting.semaphoreId != null) semaphoreRepository.findById(reporting.semaphoreId) else null

        return Triple(reporting, fullControlUnit, semaphore)
    }
}
