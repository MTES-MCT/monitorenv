package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.scheduling.annotation.Scheduled

@UseCase
class ArchiveOutdatedVigilanceAreas(
    private val vigilanceAreaRepository: IVigilanceAreaRepository,
) {
    private val logger: Logger = LoggerFactory.getLogger(ArchiveOutdatedVigilanceAreas::class.java)

    // At every 5 minutes, after 1 minute of initial delay
    @Scheduled(fixedDelay = 21600000, initialDelay = 6000)
    fun execute() {
        logger.info("Archiving vigilance areas")
        val numberOfArchivedVigilanceAreas = vigilanceAreaRepository.archiveOutdatedVigilanceAreas()
        logger.info("Archived $numberOfArchivedVigilanceAreas vigilance areas")
    }
}
