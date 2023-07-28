package fr.gouv.cacem.monitorenv.domain.use_cases.reporting

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable

@UseCase
class GetAllReportings(private val reportingRepository: IReportingRepository) {
    fun execute(
        pageNumber: Int?,
        pageSize: Int?,
    ): List<ReportingEntity> {
        return reportingRepository.findAll(
            pageable = if (pageNumber != null && pageSize != null) PageRequest.of(pageNumber, pageSize) else Pageable.unpaged(),
        )
    }
}
