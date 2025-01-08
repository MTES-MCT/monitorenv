package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaControlPlanTagRepositoryITests : AbstractDBTests() {
    @Autowired private lateinit var jpaControlPlanTagRepository: JpaControlPlanTagRepository

    @Test
    fun `findAll Should return all control plan tags`() {
        // When
        val requestedControlPlanTags = jpaControlPlanTagRepository.findAll()
        // Then
        assertThat(requestedControlPlanTags.size).isEqualTo(17)
        assertThat(requestedControlPlanTags[5].id).isEqualTo(6)
        assertThat(requestedControlPlanTags[5].themeId).isEqualTo(14)
        assertThat(requestedControlPlanTags[5].tag)
            .isEqualTo(
                "Mammifères marins",
            )
    }

    @Test
    fun `findByYear Should return all control plan tags for a specific year`() {
        // When
        val requestedControlPlanTagsFor2023 = jpaControlPlanTagRepository.findByYear(2023)
        val requestedControlPlanTagsFor2024 = jpaControlPlanTagRepository.findByYear(2024)
        // Then
        assertThat(requestedControlPlanTagsFor2023.size).isEqualTo(68)
        assertThat(requestedControlPlanTagsFor2024.size).isEqualTo(65)
        assertThat(requestedControlPlanTagsFor2024[5].id).isEqualTo(10)
        assertThat(requestedControlPlanTagsFor2024[5].themeId).isEqualTo(103)
        assertThat(requestedControlPlanTagsFor2024[5].tag)
            .isEqualTo(
                "Mammifères marins",
            )
    }
}
