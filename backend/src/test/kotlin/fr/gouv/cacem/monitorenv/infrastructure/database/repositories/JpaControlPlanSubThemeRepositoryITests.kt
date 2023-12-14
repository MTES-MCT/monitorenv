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
        assertThat(requestedControlPlanSubThemesFor2024.size).isEqualTo(7)
        assertThat(requestedControlPlanSubThemesFor2024[6].id).isEqualTo(90)
        assertThat(requestedControlPlanSubThemesFor2024[6].theme).isEqualTo(
            "Police des espèces protégées et de leurs habitats (faune et flore)",
        )
        assertThat(requestedControlPlanSubThemesFor2024[6].subTheme).isEqualTo(
            "Atteinte aux habitats d’espèces protégées",
        )
        assertThat(requestedControlPlanSubThemesFor2024[6].allowedTags).isEqualTo(
            listOf("Oiseaux", "Faune", "Flore", "Autres espèces protégées", "Reptiles", "Mammifères marins"),
        )
        assertThat(requestedControlPlanSubThemesFor2024[6].year).isEqualTo(2024)
    }
}
