package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaControlUnitRepositoryITests : AbstractDBTests() {

    @Autowired
    private lateinit var jpaControlUnitRepository: JpaControlUnitRepository

    @Test
    @Transactional
    fun `findAll should get all control units`() {
        // When
        val controlUnits = jpaControlUnitRepository.findAll()

        // Then
        assertThat(controlUnits).hasSize(33)
        assertThat(controlUnits.first().administration).isEqualTo("DDTM")
        assertThat(controlUnits.first().name).isEqualTo("Cultures marines – DDTM 30")
        assertThat(controlUnits[1].resources.first().name).isEqualTo("Semi-rigide 1")
    }
}
