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
class GetSemaphoreByIdUTest {
    private val semaphoreRepository: ISemaphoreRepository = mock()
    private val getSemaphoreById = GetSemaphoreById(semaphoreRepository)

    @Test
    fun `execute should get all semaphores`(log: CapturedOutput) {
        // Given
        val id = 1
        val expectedSemaphore = aSemaphore(id)
        given(semaphoreRepository.findById(id)).willReturn(expectedSemaphore)

        // When
        val semaphores = getSemaphoreById.execute(id)

        // Then
        assertThat(semaphores).isEqualTo(expectedSemaphore)
        assertThat(log.out).contains("GET semaphore $id")
    }
}
