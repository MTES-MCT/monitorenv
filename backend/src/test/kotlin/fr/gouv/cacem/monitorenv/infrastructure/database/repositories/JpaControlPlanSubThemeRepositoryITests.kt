package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaControlPlanSubThemeRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlPlanSubThemeRepository: JpaControlPlanSubThemeRepository

    @Test
    fun `findAll Should return all control plan subthemes `() {
        // When
        val requestedControlPlanSubThemes = jpaControlPlanSubThemeRepository.findAll()
        // Then
        assertThat(requestedControlPlanSubThemes.size).isEqualTo(6)
        assertThat(requestedControlPlanSubThemes[5].id).isEqualTo(6)
        assertThat(requestedControlPlanSubThemes[5].themeId).isEqualTo(11)
        assertThat(requestedControlPlanSubThemes[5].subTheme).isEqualTo(
            "Destruction, capture, arrachage",
        )

        assertThat(requestedControlPlanSubThemes[5].year).isEqualTo(2024)
    }
}
