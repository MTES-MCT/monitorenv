package fr.gouv.cacem.monitorenv.domain.use_cases.amps

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IAMPRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.amp.fixtures.AmpFixture.Companion.anAmp
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetAllAMPsUTest {
    private val ampRepository: IAMPRepository = mock()
    private val getAllAMPs = GetAllAMPs(ampRepository)

    @Test
    fun `execute should return all amps`(log: CapturedOutput) {
        // Given
        val expectedAmps = listOf(anAmp(), anAmp())
        given(ampRepository.findAll(false)).willReturn(expectedAmps)

        // When
        val amps = getAllAMPs.execute(false)

        // Then
        assertThat(amps).isEqualTo(expectedAmps)
        assertThat(log.out).contains("Attempt to GET all AMPs")
        assertThat(log.out).contains("Found ${amps.size} AMPs")
    }
}
