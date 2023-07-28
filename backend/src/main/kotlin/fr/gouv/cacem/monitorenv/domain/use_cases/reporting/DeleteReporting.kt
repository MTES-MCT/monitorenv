package fr.gouv.cacem.monitorenv.domain.use_cases.reporting

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository

@UseCase
class DeleteReporting(private val reportingRepository: IReportingRepository) {
    @Throws(IllegalArgumentException::class)
    fun execute(id: Int?) {
        require(id != null) {
            "No reporting to delete"
        }
        reportingRepository.delete(id)
    }
}
