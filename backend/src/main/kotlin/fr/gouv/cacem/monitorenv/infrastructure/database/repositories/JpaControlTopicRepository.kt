package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlTopics.ControlTopicEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IControlTopicRepository
import fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces.IDBControlTopicRepository

import org.springframework.stereotype.Repository

@Repository
class JpaControlTopicRepository(private val dbControlTopicRepository: IDBControlTopicRepository) :
  IControlTopicRepository {

  override fun findControlTopics(): List<ControlTopicEntity> {
    return dbControlTopicRepository.findAll().map { it.toControlTopic() }
  }

  override fun findControlTopicById(id: Int): ControlTopicEntity {
    return dbControlTopicRepository.findById(id).get().toControlTopic()
  }
}
