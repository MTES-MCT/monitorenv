package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaSpecyRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaSpecyRepository: JpaSpecyRepository

    @Test
    fun `findAll() should find all species`() {
        // Given
        val expectedSpeciesSize = 12460

        // When
        val species = jpaSpecyRepository.findAll()

        // Then
        assertThat(species).hasSize(expectedSpeciesSize)
    }
}
