package fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IInfractionsObservationsReportRepository
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable

@UseCase
class GetAllInfractionsObservationsReports(private val infractionsObservationsReportsRepository: IInfractionsObservationsReportRepository) {
    fun execute(
        pageNumber: Int?,
        pageSize: Int?,
    ): List<InfractionsObservationsReportEntity> {
        return infractionsObservationsReportsRepository.findAllInfractionsObservationsReports(
            pageable = if (pageNumber != null && pageSize != null) PageRequest.of(pageNumber, pageSize) else Pageable.unpaged(),
        )
    }
}
