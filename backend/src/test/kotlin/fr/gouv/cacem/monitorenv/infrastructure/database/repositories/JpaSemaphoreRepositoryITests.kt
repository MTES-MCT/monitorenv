package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.transaction.annotation.Transactional

class JpaSemaphoreRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaSemaphoreRepository: JpaSemaphoreRepository

    @Test
    @Transactional
    fun `findAll Should return all semaphores`() {
        // When
        val semaphores = jpaSemaphoreRepository.findAll()
        assertThat(semaphores).hasSize(10)
    }

    @Test
    @Transactional
    fun `findById should return specific semaphore`() {
        // When
        val semaphore = jpaSemaphoreRepository.findById(22)!!
        // Then
        assertThat(semaphore.id).isEqualTo(22)
        assertThat(semaphore.geom.toString()).isEqualTo("POINT (-3.473888888888889 48.82972222222222)")
        assertThat(semaphore.name).isEqualTo("SEMAPHORE PLOUMANAC'H")
        assertThat(semaphore.department).isEqualTo("22")
        assertThat(semaphore.facade).isEqualTo("NAMO")
        assertThat(semaphore.administration).isEqualTo("FOSIT")
        assertThat(semaphore.unit).isEqualTo("Sémaphore de Ploumanac’h")
        assertThat(semaphore.email).isEqualTo("sema@sema.gouv.fr")
        assertThat(semaphore.phoneNumber).isEqualTo("01 23 45 67 89")
        assertThat(semaphore.base).isEqualTo("Ploumana’ch")
    }
}
