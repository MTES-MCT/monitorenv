package fr.gouv.cacem.monitorenv.domain.use_cases.infractionsObservationsReports

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IInfractionsObservationsReportRepository

@UseCase
class GetInfractionsObservationsReportById(private val infractionsObservationsReportsRepository: IInfractionsObservationsReportRepository) {
    fun execute(id: Int): InfractionsObservationsReportEntity {
        return infractionsObservationsReportsRepository.findInfractionsObservationsReportById(id)
    }
}
