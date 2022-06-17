package fr.gouv.cacem.monitorenv.domain.use_cases.crud.controlTopics

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.controlTopics.ControlTopicEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlTopicRepository

import org.slf4j.LoggerFactory

@UseCase
class GetControlTopicById(private val controlTopicRepository: IControlTopicRepository) {
  private val logger = LoggerFactory.getLogger(GetControlTopicById::class.java)

  fun execute(controlTopicId: Int): ControlTopicEntity {
    val controlTopic = controlTopicRepository.findControlTopicById(controlTopicId)

    return controlTopic
  }
}
