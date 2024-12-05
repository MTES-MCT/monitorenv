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
        assertThat(requestedControlPlanSubThemes.size).isEqualTo(239)

        // 2023
        assertThat(requestedControlPlanSubThemes[5].year).isEqualTo(2023)
        assertThat(requestedControlPlanSubThemes[5].id).isEqualTo(6)
        assertThat(requestedControlPlanSubThemes[5].themeId).isEqualTo(4)
        assertThat(requestedControlPlanSubThemes[5].subTheme)
            .isEqualTo(
                "Atteinte aux biens culturels",
            )

        // 2024
        assertThat(requestedControlPlanSubThemes[100].year).isEqualTo(2024)
        assertThat(requestedControlPlanSubThemes[100].id).isEqualTo(117)
        assertThat(requestedControlPlanSubThemes[100].themeId).isEqualTo(103)
        assertThat(requestedControlPlanSubThemes[100].subTheme)
            .isEqualTo(
                "Destruction, capture, arrachage d'espèces protégées",
            )

        // 2025
        assertThat(requestedControlPlanSubThemes[200].year).isEqualTo(2025)
        assertThat(requestedControlPlanSubThemes[200].id).isEqualTo(217)
        assertThat(requestedControlPlanSubThemes[200].themeId).isEqualTo(107)
        assertThat(requestedControlPlanSubThemes[200].subTheme)
            .isEqualTo(
                "Autre (Culture marine)",
            )
    }

    @Test
    fun `findByYear Should return all control plan theme for a specific year`() {
        // When
        val requestedControlPlanSubThemesFor2023 = jpaControlPlanSubThemeRepository.findByYear(2023)
        val requestedControlPlanSubThemesFor2024 = jpaControlPlanSubThemeRepository.findByYear(2024)
        // Then
        assertThat(requestedControlPlanSubThemesFor2023.size).isEqualTo(83)
        assertThat(requestedControlPlanSubThemesFor2024.size).isEqualTo(78)
        assertThat(requestedControlPlanSubThemesFor2024[5].id).isEqualTo(105)
        assertThat(requestedControlPlanSubThemesFor2024[5].themeId).isEqualTo(101)
        assertThat(requestedControlPlanSubThemesFor2024[5].subTheme)
            .isEqualTo(
                "Usagers ZMEL",
            )

        assertThat(requestedControlPlanSubThemesFor2024[5].year).isEqualTo(2024)
    }
}
