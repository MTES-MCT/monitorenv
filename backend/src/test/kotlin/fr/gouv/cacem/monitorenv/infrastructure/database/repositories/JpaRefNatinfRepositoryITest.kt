package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired

class JpaRefNatinfRepositoryITest : AbstractDBTests() {
    @Autowired
    lateinit var jpaRefNatinfRepository: JpaRefNatinfRepository

    @Test
    fun `findAll should return all refNatinfs`() {
        // When
        val refNatinfs = jpaRefNatinfRepository.findAll()

        // Then
        assertThat(refNatinfs).isNotEmpty()
    }
}
