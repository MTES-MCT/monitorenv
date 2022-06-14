package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.controlTopics.ControlTopicEntity

interface IControlTopicRepository {
    fun findControlTopicById(controlTopicId: Int): ControlTopicEntity
    fun findControlTopics(): List<ControlTopicEntity>
}
