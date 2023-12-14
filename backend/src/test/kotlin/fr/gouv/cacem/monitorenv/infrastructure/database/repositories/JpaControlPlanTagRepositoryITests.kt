package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaControlPlanTagRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlPlanTagRepository: JpaControlPlanTagRepository

    @Test
    fun `findByYear Should return all control plan tags for a specific year`() {
        // When
        val requestedControlPlanTagsFor2023 = jpaControlPlanTagRepository.findByYear(2023)
        val requestedControlPlanTagsFor2024 = jpaControlPlanTagRepository.findByYear(2024)
        // Then
        assertThat(requestedControlPlanTagsFor2023.size).isEqualTo(48)
        assertThat(requestedControlPlanTagsFor2024.size).isEqualTo(6)
        assertThat(requestedControlPlanTagsFor2024[5].id).isEqualTo(6)
        assertThat(requestedControlPlanTagsFor2024[5].themeId).isEqualTo(11)
        assertThat(requestedControlPlanTagsFor2024[5].tag).isEqualTo(
            "Reptiles",
        )
    }
}
