package fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IInfractionsObservationsReportRepository

@UseCase
class CreateOrUpdateInfractionsObservationsReport(private val infractionsObservationsReportsRepository: IInfractionsObservationsReportRepository) {
    @Throws(IllegalArgumentException::class)
    fun execute(infractionObservationReport: InfractionsObservationsReportEntity?): InfractionsObservationsReportEntity {
        require(infractionObservationReport != null) {
            "No infractionObservationReport to create or update"
        }
        return infractionsObservationsReportsRepository.save(infractionObservationReport)
    }
}
