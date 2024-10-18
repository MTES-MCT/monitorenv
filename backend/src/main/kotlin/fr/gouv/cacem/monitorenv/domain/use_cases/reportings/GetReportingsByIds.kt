package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO

@UseCase
class GetReportingsByIds(
    private val reportingRepository: IReportingRepository,
) {
    fun execute(ids: List<Int>): List<ReportingDTO> {
        val reportings = reportingRepository.findAllById(ids)

        return reportings
    }
}
