package fr.gouv.cacem.monitorenv.domain.use_cases.semaphores

import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock

class GetAllSemaphoresTest {
    private val semaphoreRepository: ISemaphoreRepository = mock()
    private val getAllSemaphores = GetAllSemaphores(semaphoreRepository)

    @Test
    fun execute() {
        // Given

        // When

        // Then
    }
}