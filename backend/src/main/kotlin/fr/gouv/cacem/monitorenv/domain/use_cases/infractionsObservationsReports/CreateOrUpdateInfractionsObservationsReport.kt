package fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports

import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IInfractionsObservationsReportRepository

class CreateOrUpdateInfractionsObservationsReport(private val infractionsObservationsReportsRepository: IInfractionsObservationsReportRepository) {
    fun execute(infractionObservationReport: InfractionsObservationsReportEntity): InfractionsObservationsReportEntity {
        return infractionsObservationsReportsRepository.save(infractionObservationReport)
    }
}
