package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class DeleteReporting(private val reportingRepository: IReportingRepository) {
    private val logger: Logger = LoggerFactory.getLogger(DeleteReporting::class.java)

    fun execute(id: Int) {
        logger.info("Attempt to DELETE reporting $id")
        reportingRepository.delete(id)
        logger.info("reporting $id deleted")
    }
}
