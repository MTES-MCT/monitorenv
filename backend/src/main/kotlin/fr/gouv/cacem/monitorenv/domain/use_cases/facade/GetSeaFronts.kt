package fr.gouv.cacem.monitorenv.domain.use_cases.facade

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.ISeaFrontRepository
import org.slf4j.LoggerFactory

@UseCase
class GetSeaFronts(
    private val seaFrontRepository: ISeaFrontRepository,
) {
    private val logger = LoggerFactory.getLogger(GetSeaFronts::class.java)

    fun execute(): List<String> {
        logger.info("Attempt to GET all facades")
        val facades = seaFrontRepository.findAllFacade()
        logger.info("Found ${facades.size} facades")

        return facades
    }
}
