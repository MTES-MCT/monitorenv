package fr.gouv.cacem.monitorenv.domain.use_cases.reporting

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository

@UseCase
class GetReportingById(private val reportingRepository: IReportingRepository) {
    fun execute(id: Int): ReportingEntity {
        return reportingRepository.findById(id)
    }
}
