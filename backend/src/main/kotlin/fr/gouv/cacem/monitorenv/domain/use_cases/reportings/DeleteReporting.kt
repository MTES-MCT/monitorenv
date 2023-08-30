package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class DeleteReporting(private val reportingRepository: IReportingRepository) {
    private val logger: Logger = LoggerFactory.getLogger(DeleteReporting::class.java)

    @Throws(IllegalArgumentException::class)
    fun execute(id: Int?) {
        logger.info("Delete reporting: $id")

        require(id != null) {
            "No reporting to delete"
        }
        reportingRepository.delete(id)
    }
}
