package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaLastPositionRepositoryTest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaLastPositionRepository: JpaLastPositionRepository

    @Test
    fun `findAll should return all last positions from shipId`() {
        // Given
        val shipId = 11

        // When
        val lastPositions = jpaLastPositionRepository.findAll(shipId)

        // Then
        assertThat(lastPositions).hasSize(1)
    }

    @Test
    fun `findAll should return empty from shipId when shipIp is unknown`() {
        // Given
        val shipId = 999999

        // When
        val lastPositions = jpaLastPositionRepository.findAll(shipId)

        // Then
        assertThat(lastPositions).isEmpty()
    }
}
