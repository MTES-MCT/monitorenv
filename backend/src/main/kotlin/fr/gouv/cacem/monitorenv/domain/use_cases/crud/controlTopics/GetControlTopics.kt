package fr.gouv.cacem.monitorenv.domain.use_cases.crud.controlTopics

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlTopics.ControlTopicEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlTopicRepository

import org.slf4j.LoggerFactory

@UseCase
class GetControlTopics(private val controlTopicRepository: IControlTopicRepository) {
  private val logger = LoggerFactory.getLogger(GetControlTopics::class.java)

  fun execute(): List<ControlTopicEntity> {
    val regulatoryAreas = controlTopicRepository.findControlTopics()
    logger.info("Found ${regulatoryAreas.size} control topics ")

    return regulatoryAreas
  }
}
