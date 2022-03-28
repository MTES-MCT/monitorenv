package fr.gouv.cacem.monitorenv.domain.use_cases.crud.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository

import org.slf4j.LoggerFactory

@UseCase
class GetRegulatoryAreas(private val regulatoryAreaRepository: IRegulatoryAreaRepository) {
  private val logger = LoggerFactory.getLogger(GetRegulatoryAreas::class.java)

  fun execute(): List<RegulatoryAreaEntity> {
    val regulatoryAreas = regulatoryAreaRepository.findRegulatoryAreas()
    logger.info("Found ${regulatoryAreas.size} operations ")

    return regulatoryAreas
  }
}
