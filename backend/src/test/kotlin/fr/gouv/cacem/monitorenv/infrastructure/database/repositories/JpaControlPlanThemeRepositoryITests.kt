package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaControlPlanThemeRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlPlanThemeRepository: JpaControlPlanThemeRepository

    @Test
    fun `findAll Should return all control plan themes`() {
        // When
        val requestedControlPlanThemes = jpaControlPlanThemeRepository.findAll()
        // Then
        assertThat(requestedControlPlanThemes.size).isEqualTo(22)
        assertThat(requestedControlPlanThemes[5].id).isEqualTo(6)
        assertThat(requestedControlPlanThemes[5].theme).isEqualTo("Divers")
    }
}
