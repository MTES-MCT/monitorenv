package fr.gouv.cacem.monitorenv.infrastructure.database.repositories


import fr.gouv.cacem.monitorenv.domain.entities.controlThemes.ControlThemeEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlThemeModel

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaControlThemeRepositoryITests : AbstractDBTests() {

  @Autowired
  private lateinit var jpaControlThemesRepository: JpaControlThemeRepository

  @Test
  @Transactional
  fun `findControlThemes Should return all control theme`() {
    // When
    val controlThemes = jpaControlThemesRepository.findControlThemes()
    assertThat(controlThemes).hasSize(83)
  }

  @Test
  @Transactional
  fun `findControlThemeById Should return specific ControlTheme`() {

    // Given
    val searchedControlTheme = ControlThemeModel.fromControlThemeEntity(
      ControlThemeEntity(
        id = 1,
        theme_level_1 = "Police des mouillages",
        theme_level_2 = "Mouillage individuel"
      )
    )
    // When
    val requestedControlTheme = jpaControlThemesRepository.findControlThemeById(1)
    // Then
    assertThat(requestedControlTheme.id).isEqualTo(searchedControlTheme.id)
    assertThat(requestedControlTheme.theme_level_1).isEqualTo(searchedControlTheme.theme_level_1)
    assertThat(requestedControlTheme.theme_level_2).isEqualTo(searchedControlTheme.theme_level_2)
  }

}
