package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas // ktlint-disable package-name

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository
import org.slf4j.LoggerFactory

@UseCase
class GetAllRegulatoryAreas(private val regulatoryAreaRepository: IRegulatoryAreaRepository) {
    private val logger = LoggerFactory.getLogger(GetAllRegulatoryAreas::class.java)

    fun execute(): List<RegulatoryAreaEntity> {
        val regulatoryAreas = regulatoryAreaRepository.findAll()
        logger.info("Found ${regulatoryAreas.size} regulatory areas ")

        return regulatoryAreas
    }
}
