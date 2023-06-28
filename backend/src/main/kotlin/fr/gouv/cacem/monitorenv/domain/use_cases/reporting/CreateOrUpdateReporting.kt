package fr.gouv.cacem.monitorenv.domain.use_cases.reporting

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository

@UseCase
class CreateOrUpdateReporting(private val reportingRepository: IReportingRepository) {
    @Throws(IllegalArgumentException::class)
    fun execute(reporting: ReportingEntity?): ReportingEntity {
        require(reporting != null) {
            "No reporting to create or update"
        }
        return reportingRepository.save(reporting)
    }
}
