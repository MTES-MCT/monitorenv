package fr.gouv.cacem.monitorenv.domain.use_cases.reporting

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository

@UseCase
class CreateOrUpdateReporting(
    private val reportingRepository: IReportingRepository,
    private val controlUnitRepository: IControlUnitRepository,
    private val semaphoreRepository: ISemaphoreRepository,
) {
    @Throws(IllegalArgumentException::class)
    fun execute(reporting: ReportingEntity?): Triple<ReportingEntity, ControlUnitEntity?, SemaphoreEntity?> {
        require(reporting != null) {
            "No reporting to create or update"
        }
        val reporting = reportingRepository.save(reporting)

        val controlUnit = if (reporting.controlUnitId != null) controlUnitRepository.findControlUnitById(reporting.controlUnitId) else null
        val semaphore = if (reporting.semaphoreId != null) semaphoreRepository.findSemaphoreById(reporting.semaphoreId) else null

        return Triple(reporting, controlUnit, semaphore)
    }
}
