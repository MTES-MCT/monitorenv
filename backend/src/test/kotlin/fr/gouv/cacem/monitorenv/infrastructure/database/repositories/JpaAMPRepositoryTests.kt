package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaAMPRepositoryTests : AbstractDBTests() {

    @Autowired
    private lateinit var jpaAMPRepository: JpaAMPRepository

    @Test
    @Transactional
    fun `findAll Should return all amps`() {
        // When
        val amps = jpaAMPRepository.findAll()
        assertThat(amps).hasSize(20)
    }
}
