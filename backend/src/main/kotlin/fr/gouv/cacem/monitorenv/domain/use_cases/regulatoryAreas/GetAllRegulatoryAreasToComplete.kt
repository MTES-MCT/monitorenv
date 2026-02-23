package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.v2.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaNewRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllRegulatoryAreasToComplete(
    private val regulatoryAreaRepository: IRegulatoryAreaNewRepository,
) {
    private val logger = LoggerFactory.getLogger(GetAllRegulatoryAreasToComplete::class.java)

    fun execute(): List<RegulatoryAreaEntity> {
        logger.info("Attempt to GET all regulatory areas to create")
        val regulatoryAreas = regulatoryAreaRepository.findAllToComplete()
        logger.info("Found ${regulatoryAreas.size} regulatory areas to create")

        return regulatoryAreas
    }
}
