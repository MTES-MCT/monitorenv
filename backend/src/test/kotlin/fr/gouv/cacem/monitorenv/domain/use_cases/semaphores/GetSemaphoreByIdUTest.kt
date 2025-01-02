package fr.gouv.cacem.monitorenv.domain.use_cases.semaphores

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.ISemaphoreRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.semaphores.fixtures.SemaphoreFixture.Companion.aSemaphore
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAllSemaphoresUTest {
    private val semaphoreRepository: ISemaphoreRepository = mock()
    private val getAllSemaphores = GetAllSemaphores(semaphoreRepository)

    @Test
    fun `execute should get all semaphores`(log: CapturedOutput) {
        // Given
        val expectedSemaphores = listOf(aSemaphore(1), aSemaphore(2))
        given(semaphoreRepository.findAll()).willReturn(expectedSemaphores)

        // When
        val semaphores = getAllSemaphores.execute()

        // Then
        assertThat(semaphores).isEqualTo(expectedSemaphores)
        assertThat(log.out).contains("Attempt to GET all semaphores")
        assertThat(log.out).contains("Found ${semaphores.size} semaphores")
    }
}