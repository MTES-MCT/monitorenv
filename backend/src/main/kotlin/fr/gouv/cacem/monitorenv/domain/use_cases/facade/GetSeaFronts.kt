package fr.gouv.cacem.monitorenv.domain.use_cases.facade

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.seafront.SeaFrontEntity
import fr.gouv.cacem.monitorenv.domain.repositories.ISeaFrontRepository
import org.slf4j.LoggerFactory

@UseCase
class GetSeaFronts(
    private val seaFrontRepository: ISeaFrontRepository,
) {
    private val logger = LoggerFactory.getLogger(GetSeaFronts::class.java)

    fun execute(): List<SeaFrontEntity> {
        logger.info("Attempt to GET all facades")
        val facades = seaFrontRepository.findAll()
        logger.info("Found ${facades.size} facades")

        return facades
    }
}
