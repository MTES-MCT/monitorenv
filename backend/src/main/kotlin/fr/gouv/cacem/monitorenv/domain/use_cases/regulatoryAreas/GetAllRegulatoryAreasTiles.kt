package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllRegulatoryAreasTiles(
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllRegulatoryAreas::class.java)

    fun execute(
        filters: SearchFilters,
        x: Int,
        y: Int,
        z: Int,
    ): ByteArray {
        logger.info("Attempt to GET all regulatory areas")

        return regulatoryAreaRepository.findAllTiles(
            filters = filters,
            x = x,
            y = y,
            z = z,
        )
    }
}
