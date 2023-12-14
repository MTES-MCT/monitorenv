package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaControlPlanTagRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaControlPlanTagRepository: JpaControlPlanTagRepository

    @Test
    fun `findAll Should return all control plan tags`() {
        // When
        val requestedControlPlanTags = jpaControlPlanTagRepository.findAll()
        // Then
        assertThat(requestedControlPlanTags.size).isEqualTo(6)
        assertThat(requestedControlPlanTags[5].id).isEqualTo(6)
        assertThat(requestedControlPlanTags[5].themeId).isEqualTo(11)
        assertThat(requestedControlPlanTags[5].tag).isEqualTo(
            "Mammifères marins",
        )
    }
}
