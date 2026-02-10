package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaRegulatoryAreaNewRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaRegulatoryAreaNewRepository: JpaRegulatoryAreaNewRepository

    @Test
    @Transactional
    fun `findAll Should return all regulatoryAreas`() {
        // When
        val regulatoryAreas = jpaRegulatoryAreaNewRepository.findAll()
        assertThat(regulatoryAreas).hasSize(13)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when seafront filter is set to NAMO`() {
        val regulatoryAreas =
            jpaRegulatoryAreaNewRepository.findAll(
                seaFronts = listOf("NAMO"),
            )
        println("regulatoryAreas : $regulatoryAreas")
        assertThat(regulatoryAreas.size).isEqualTo(12)
    }

    @Test
    @Transactional
    fun `findAll should return all regulatoryAreas when seafront filter is set to MED`() {
        val regulatoryAreas =
            jpaRegulatoryAreaNewRepository.findAll(
                seaFronts = listOf("MED"),
            )
        println("regulatoryAreas : $regulatoryAreas")
        assertThat(regulatoryAreas.size).isEqualTo(1)
    }
}
