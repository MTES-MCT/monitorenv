package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaControlPlanSubThemeRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlPlanSubThemeRepository: JpaControlPlanSubThemeRepository

    @Test
    fun `findByYear Should return all control plan theme for a specific year`() {
        // When
        val requestedControlPlanSubThemesFor2023 = jpaControlPlanSubThemeRepository.findByYear(2023)
        val requestedControlPlanSubThemesFor2024 = jpaControlPlanSubThemeRepository.findByYear(2024)
        // Then
        assertThat(requestedControlPlanSubThemesFor2023.size).isEqualTo(83)
        assertThat(requestedControlPlanSubThemesFor2024.size).isEqualTo(6)
        assertThat(requestedControlPlanSubThemesFor2024[5].id).isEqualTo(89)
        assertThat(requestedControlPlanSubThemesFor2024[5].themeId).isEqualTo(11)
        assertThat(requestedControlPlanSubThemesFor2024[5].subTheme).isEqualTo(
            "Destruction, capture, arrachage",
        )

        assertThat(requestedControlPlanSubThemesFor2024[5].year).isEqualTo(2024)
    }
}
