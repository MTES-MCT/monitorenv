package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllLayerNames(
    private val regulatoryAreaRepository: IRegulatoryAreaNewRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllLayerNames::class.java)

    fun execute(): List<String> {
        logger.info("Attempt to GET all regulatory areas layer names")
        val layerNames = regulatoryAreaRepository.findAllLayerNames()
        logger.info("Found ${layerNames.size} layer names")

        return layerNames
    }
}
