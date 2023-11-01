package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO

@UseCase
class GetReportingById(
    private val reportingRepository: IReportingRepository

) {
    fun execute(id: Int): ReportingDTO {
        val reporting = reportingRepository.findById(id)

        return reporting
    }
}
