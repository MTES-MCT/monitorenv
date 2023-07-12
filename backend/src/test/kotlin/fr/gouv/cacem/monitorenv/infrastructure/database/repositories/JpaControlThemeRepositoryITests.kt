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
    fun `findAll Should return all control theme`() {
        // When
        val controlThemes = jpaControlThemesRepository.findAll()
        assertThat(controlThemes).hasSize(83)
    }

    @Test
    @Transactional
    fun `findById Should return specific ControlTheme`() {
        // Given
        val searchedControlTheme = ControlThemeModel.fromControlThemeEntity(
            ControlThemeEntity(
                id = 1,
                themeLevel1 = "Police des mouillages",
                themeLevel2 = "Mouillage individuel",
            ),
        )
        // When
        val requestedControlTheme = jpaControlThemesRepository.findById(1)
        // Then
        assertThat(requestedControlTheme.id).isEqualTo(searchedControlTheme.id)
        assertThat(requestedControlTheme.themeLevel1).isEqualTo(searchedControlTheme.themeLevel1)
        assertThat(requestedControlTheme.themeLevel2).isEqualTo(searchedControlTheme.themeLevel2)
    }
}
