package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaControlPlanThemeRepositoryITests : AbstractDBTests() {
    @Autowired private lateinit var jpaControlPlanThemeRepository: JpaControlPlanThemeRepository

    @Test
    fun `findAll Should return all control plan themes`() {
        // When
        val requestedControlPlanThemes = jpaControlPlanThemeRepository.findAll()
        // Then
        assertThat(requestedControlPlanThemes.size).isEqualTo(22)
        assertThat(requestedControlPlanThemes[5].id).isEqualTo(6)
        assertThat(requestedControlPlanThemes[5].theme).isEqualTo("Divers")
    }

    @Test
    fun `findByYear Should return all control plan theme for a specific year`() {
        // When
        val requestedControlPlanThemesFor2023 = jpaControlPlanThemeRepository.findByYear(2023)
        val requestedControlPlanThemesFor2024 = jpaControlPlanThemeRepository.findByYear(2024)
        // Then
        assertThat(requestedControlPlanThemesFor2023.size).isEqualTo(83)
        assertThat(requestedControlPlanThemesFor2024.size).isEqualTo(6)
        assertThat(requestedControlPlanThemesFor2024[5].id).isEqualTo(100002)
        assertThat(requestedControlPlanThemesFor2024[5].theme).isEqualTo("Rejet")
    }
}
