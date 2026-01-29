package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.use_cases.natinfs.fixtures.NatinfFixture.Companion.aNatinf
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaNatinfRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaNatinfsRepository: JpaNatinfRepository

    @Test
    @Transactional
    fun `findAll Should return all natinfs`() {
        // When
        val natinfs = jpaNatinfsRepository.findAll()
        assertThat(natinfs).hasSize(645)
    }

    @Test
    fun `save should create a new natinf with its themes`() {
        // Given
        val natinf = aNatinf(id = 7)

        // When
        val savedNatinf = jpaNatinfsRepository.save(natinf = natinf)

        // Then
        assertThat(savedNatinf.themes).isNotEmpty()
    }
}
