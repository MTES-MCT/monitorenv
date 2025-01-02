package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled

@UseCase
class ArchiveOutdatedReportings(
    private val reportingRepository: IReportingRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(ArchiveOutdatedReportings::class.java)

    // At every 5 minutes, after 1 minute of initial delay
    @Scheduled(fixedDelay = 300000, initialDelay = 6000)
    fun execute() {
        logger.info("Attempt to ARCHIVE reportings")
        val numberOfArchivedReportings = reportingRepository.archiveOutdatedReportings()
        logger.info("$numberOfArchivedReportings reportings archived")
    }
}
