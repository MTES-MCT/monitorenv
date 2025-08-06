package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllRegulatoryAreas(
    private val regulatoryAreaRepository: IRegulatoryAreaRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllRegulatoryAreas::class.java)

    fun execute(
        withGeometry: Boolean,
        zoom: Int? = null,
        bbox: List<Double>? = null,
    ): List<RegulatoryAreaEntity> {
        logger.info("Attempt to GET all regulatory areas")
        val regulatoryAreas = regulatoryAreaRepository.findAll(withGeometry, zoom, bbox)
        logger.info("Found ${regulatoryAreas.size} regulatory areas")

        return regulatoryAreas
    }
}
