package fr.gouv.cacem.monitorenv.infrastructure.database.repositories


import fr.gouv.cacem.monitorenv.domain.entities.controlTopics.ControlTopicEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlTopicModel

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader

class JpaControlTopciRepositoryITests : AbstractDBTests() {

  @Autowired
  private lateinit var jpaControlTopicsRepository: JpaControlTopicRepository

  @Test
  @Transactional
  fun `findControlTopics Should return all control topics`() {
    // When
    val controlTopics = jpaControlTopicsRepository.findControlTopics()
    assertThat(controlTopics).hasSize(83)
  }

  @Test
  @Transactional
  fun `findControlTopicById Should return specific ControlTopic`() {

    // Given
    val searchedControlTopic = ControlTopicModel.fromControlTopicEntity(
      ControlTopicEntity(
        id = 3,
        topic_level_1 = "Police des mouillages",
        topic_level_2 = "mouillage individuel",
        topic_level_3 = "autre mouillage ayant un impact sur l’environnement"
      )
    )
    // When
    val requestedControlTopic = jpaControlTopicsRepository.findControlTopicById(3)
    // Then
    assertThat(requestedControlTopic.id).isEqualTo(searchedControlTopic.id)
    assertThat(requestedControlTopic.topic_level_1).isEqualTo(searchedControlTopic.topic_level_1)
    assertThat(requestedControlTopic.topic_level_2).isEqualTo(searchedControlTopic.topic_level_2)
    assertThat(requestedControlTopic.topic_level_3).isEqualTo(searchedControlTopic.topic_level_3)
  }

}
