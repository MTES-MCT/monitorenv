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

    @Test
    @Transactional
    fun `findAllByThemesIds Should return natinfs from theme ids`() {
        // When
        val themeIds = listOf(323)
        val natinfs = jpaNatinfsRepository.findAllByThemesIds(themeIds)
        assertThat(natinfs).hasSize(3)
    }

    @Test
    @Transactional
    fun `findAllByThemesIds Should be empty if there are no theme ids`() {
        // When
        val themeIds = listOf<Int>()
        val natinfs = jpaNatinfsRepository.findAllByThemesIds(themeIds)
        assertThat(natinfs).isEmpty()
    }
}
