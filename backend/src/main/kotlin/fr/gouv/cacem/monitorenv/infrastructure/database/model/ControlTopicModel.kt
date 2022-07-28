package fr.gouv.cacem.monitorenv.infrastructure.database.model


import fr.gouv.cacem.monitorenv.domain.entities.controlTopics.ControlTopicEntity
import javax.persistence.*

@Entity
@Table(name = "control_topics")
data class ControlTopicModel(
  @Id
  @Column(name = "id")
  var id: Int,
  @Column(name = "topic_level_1")
  var topic_level_1: String,
  @Column(name = "topic_level_2")
  var topic_level_2: String?
) {
  fun toControlTopic() = ControlTopicEntity(
    id = id,
    topic_level_1 = topic_level_1,
    topic_level_2 = topic_level_2
  )

  companion object {
    fun fromControlTopicEntity(controlTopic: ControlTopicEntity) = ControlTopicModel(
      id = controlTopic.id,
      topic_level_1 = controlTopic.topic_level_1,
      topic_level_2 = controlTopic.topic_level_2
    )
  }
}
