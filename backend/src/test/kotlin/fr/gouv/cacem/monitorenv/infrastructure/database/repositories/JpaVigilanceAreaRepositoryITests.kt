package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaVigilanceAreaRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaVigilanceAreaRepository: JpaVigilanceAreaRepository

    @Test
    @Transactional
    fun `findAll Should return all vigilance areas`() {
        // When
        val vigilanceAreas = jpaVigilanceAreaRepository.findAll()
        // Then
        assertThat(vigilanceAreas).isNotEmpty
    }

    @Test
    @Transactional
    fun `findById should return specific vigilance area`() {
        // Given
        val expectedVigilanceAreaId = 1
        // When
        val vigilanceArea = jpaVigilanceAreaRepository.findById(expectedVigilanceAreaId)
        // Then
        assertThat(vigilanceArea.id).isEqualTo(expectedVigilanceAreaId)
        // Add more assertions based on the properties of VigilanceArea
    }
}
