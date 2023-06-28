package fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IInfractionsObservationsReportRepository

@UseCase
class DeleteInfractionsObservationsReport(private val infractionsObservationsReportsRepository: IInfractionsObservationsReportRepository) {
    @Throws(IllegalArgumentException::class)
    fun execute(id: Int?) {
        require(id != null) {
            "No InfractionsObservationsReport to delete"
        }
        infractionsObservationsReportsRepository.delete(id)
    }
}
