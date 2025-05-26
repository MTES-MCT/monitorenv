package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JPALocalizedAreaRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaLocalizedAreaRepository: JpaLocalizedAreaRepository

    @Test
    @Transactional
    fun `findAll Should return all localizedAreas`() {
        // When
        val localizedAreas = jpaLocalizedAreaRepository.findAll()
        assertThat(localizedAreas).hasSize(2)
    }
}
