package fr.gouv.cacem.monitorenv.domain.use_cases.amps

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.GetAllRegulatoryAreas
import org.slf4j.LoggerFactory

@UseCase
class GetAllAmpsTiles(
    private val ampRepository: IAMPRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllRegulatoryAreas::class.java)

    fun execute(
        filters: SearchFilters,
        x: Int,
        y: Int,
        z: Int,
    ): ByteArray {
        logger.info("Attempt to GET all amps")

        return ampRepository.findAllTiles(
            filters,
            x = x,
            y = y,
            z = z,
        )
    }
}
