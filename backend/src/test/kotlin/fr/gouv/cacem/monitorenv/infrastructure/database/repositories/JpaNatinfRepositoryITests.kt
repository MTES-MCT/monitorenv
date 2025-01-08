package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

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
}
