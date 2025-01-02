package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IVigilanceAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetVigilanceAreas(private val vigilanceAreaRepository: IVigilanceAreaRepository) {
    private val logger = LoggerFactory.getLogger(GetVigilanceAreas::class.java)

    fun execute(): List<VigilanceAreaEntity> {
        logger.info("Attempt to GET all vigilance areas")
        val vigilanceAreas = vigilanceAreaRepository.findAll()
        logger.info("Found ${vigilanceAreas.size} vigilance areas")
        return vigilanceAreas
    }
}
