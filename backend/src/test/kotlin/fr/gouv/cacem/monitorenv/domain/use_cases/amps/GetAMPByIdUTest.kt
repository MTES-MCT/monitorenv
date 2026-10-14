package fr.gouv.cacem.monitorenv.domain.use_cases.amps

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.fixtures.AmpFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAMPByIdUTest {
    private val ampRepository: IAMPRepository = mock()
    private val getAMPById = GetAMPById(ampRepository)

    @Test
    fun `execute should return an AMP by its id `(log: CapturedOutput) {
        val id = 1
        val expectedAmp = AmpFixture.anAmp(id = id)
        given(ampRepository.findById(id)).willReturn(expectedAmp)

        // When
        val amp = getAMPById.execute(id)

        // Then
        assertThat(expectedAmp).isEqualTo(amp)
        assertThat(log.out).contains("GET AMP $id")
    }

    @Test
    fun `execute should throw a backendException an AMP by its id `() {
        val id = 1
        given(ampRepository.findById(id)).willReturn(null)

        // When
        val exception =
            assertThrows<BackendUsageException> { getAMPById.execute(id) }

        // Then
        assertThat(exception.message).isEqualTo("AMP $id not found")
    }
}
