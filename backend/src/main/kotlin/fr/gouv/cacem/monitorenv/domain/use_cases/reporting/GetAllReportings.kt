package fr.gouv.cacem.monitorenv.domain.use_cases.reporting

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlUnitRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable

@UseCase
class GetAllReportings(
    private val reportingRepository: IReportingRepository,
    private val controlUnitRepository: IControlUnitRepository,
    private val semaphoreRepository: ISemaphoreRepository,
) {
    fun execute(
        pageNumber: Int?,
        pageSize: Int?,
    ): List<Triple<ReportingEntity, ControlUnitEntity?, SemaphoreEntity?>> {
        val reportings = reportingRepository.findAll(
            pageable = if (pageNumber != null && pageSize != null) PageRequest.of(pageNumber, pageSize) else Pageable.unpaged(),
        )
        val controlUnits = controlUnitRepository.findControlUnits()
        val semaphores = semaphoreRepository.findAllSemaphores()
        return reportings.map { reporting ->
            return@map Triple(
                reporting,
                controlUnits.find { it.id == reporting.controlUnitId },
                semaphores.find { it.id == reporting.semaphoreId },
            )
        }
    }
}
