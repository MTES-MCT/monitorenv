package fr.gouv.cacem.monitorenv.infrastructure.database.model


import fr.gouv.cacem.monitorenv.domain.entities.controlThemes.ControlThemeEntity
import javax.persistence.*

@Entity
@Table(name = "control_themes")
data class ControlThemeModel(
  @Id
  @Column(name = "id")
  var id: Int,
  @Column(name = "theme_level_1")
  var theme_level_1: String,
  @Column(name = "theme_level_2")
  var theme_level_2: String?
) {
  fun toControlTheme() = ControlThemeEntity(
    id = id,
    theme_level_1 = theme_level_1,
    theme_level_2 = theme_level_2
  )

  companion object {
    fun fromControlThemeEntity(controlTheme: ControlThemeEntity) = ControlThemeModel(
      id = controlTheme.id,
      theme_level_1 = controlTheme.theme_level_1,
      theme_level_2 = controlTheme.theme_level_2
    )
  }
}
