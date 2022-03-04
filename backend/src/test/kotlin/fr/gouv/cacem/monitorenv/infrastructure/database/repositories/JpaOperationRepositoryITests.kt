package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaOperationRepositoryITests : AbstractDBTests() {

    @Autowired
    private lateinit var jpaOperationRepository: JpaOperationRepository

    @Test
    @Transactional
    fun `findAll Should return all operations`() {
        // When
        val operations = jpaOperationRepository.findOperations()

        assertThat(operations).hasSize(50)
    }

}
