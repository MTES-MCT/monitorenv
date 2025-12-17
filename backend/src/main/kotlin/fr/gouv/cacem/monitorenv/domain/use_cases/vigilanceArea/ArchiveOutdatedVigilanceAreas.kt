package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory

@UseCase
class ArchiveOutdatedVigilanceAreas(
    private val vigilanceAreaRepository: IVigilanceAreaRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(ArchiveOutdatedVigilanceAreas::class.java)

    // At every 6 hours, after 1 minute of initial delay
//    @Scheduled(fixedDelay = 21600000, initialDelay = 6000)
    fun execute() {
        logger.info("Attempt to ARCHIVE vigilance areas")
        val numberOfArchivedVigilanceAreas = vigilanceAreaRepository.archiveOutdatedVigilanceAreas()
        logger.info("$numberOfArchivedVigilanceAreas vigilance areas archived")
    }
}
