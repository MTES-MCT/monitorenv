package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaControlPlanThemeRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlPlanThemeRepository: JpaControlPlanThemeRepository

    @Test
    fun `findByYear Should return all control plan theme for a specific year`() {
        // When
        val requestedControlPlanThemesFor2023 = jpaControlPlanThemeRepository.findByYear(2023)
        val requestedControlPlanThemesFor2024 = jpaControlPlanThemeRepository.findByYear(2024)
        // Then
        assertThat(requestedControlPlanThemesFor2023.size).isEqualTo(83)
        assertThat(requestedControlPlanThemesFor2024.size).isEqualTo(7)
        assertThat(requestedControlPlanThemesFor2024[6].id).isEqualTo(90)
        assertThat(requestedControlPlanThemesFor2024[6].theme).isEqualTo(
            "Police des espèces protégées et de leurs habitats (faune et flore)",
        )
        assertThat(requestedControlPlanThemesFor2024[6].subTheme).isEqualTo("Atteinte aux habitats d’espèces protégées")
        assertThat(requestedControlPlanThemesFor2024[6].allowedTags).isEqualTo(
            listOf("Oiseaux", "Faune", "Flore", "Autres espèces protégées", "Reptiles", "Mammifères marins"),
        )
        assertThat(requestedControlPlanThemesFor2024[6].year).isEqualTo(2024)
    }
}
