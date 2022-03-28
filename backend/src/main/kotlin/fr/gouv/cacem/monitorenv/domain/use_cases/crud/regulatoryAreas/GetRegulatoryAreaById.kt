package fr.gouv.cacem.monitorenv.domain.use_cases.crud.regulatoryAreas

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRegulatoryAreaRepository

import org.slf4j.LoggerFactory

@UseCase
class GetRegulatoryAreaById(private val regulatoryAreaRepository: IRegulatoryAreaRepository) {
  private val logger = LoggerFactory.getLogger(GetRegulatoryAreaById::class.java)

  fun execute(regulatoryAreaId: Int): RegulatoryAreaEntity {
    val regulatoryArea = regulatoryAreaRepository.findRegulatoryAreaById(regulatoryAreaId)

    return regulatoryArea
  }
}
