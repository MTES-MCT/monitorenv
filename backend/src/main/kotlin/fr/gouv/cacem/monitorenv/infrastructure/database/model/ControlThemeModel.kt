package fr.gouv.cacem.monitorenv.infrastructure.database.model


import fr.gouv.cacem.monitorenv.domain.entities.controlThemes.ControlThemeEntity
import javax.persistence.*

@Entity
@Table(name = "control_topics")
data class ControlThemeModel(
  @Id
  @Column(name = "id")
  var id: Int,
  @Column(name = "topic_level_1")
  var topic_level_1: String,
  @Column(name = "topic_level_2")
  var topic_level_2: String?
) {
  fun toControlTheme() = ControlThemeEntity(
    id = id,
    topic_level_1 = topic_level_1,
    topic_level_2 = topic_level_2
  )

  companion object {
    fun fromControlThemeEntity(controlTheme: ControlThemeEntity) = ControlThemeModel(
      id = controlTheme.id,
      topic_level_1 = controlTheme.topic_level_1,
      topic_level_2 = controlTheme.topic_level_2
    )
  }
}
