package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SuspicionOfOffense
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetNbSuspicionOfOffenseByMmsiUTest {
    private val reportingRepository: IReportingRepository = mock()

    val getSuspicionOfOffenseByMmsi = GetSuspicionOfOffenseByMmsi(reportingRepository)

    @Test
    fun `execute should return nb of suspicion of offense with given MMSI`(log: CapturedOutput) {
        // Given
        val mmsi = "0123456789"
        val expectedSuspicionOfOffense = SuspicionOfOffense(1, arrayOf("themes"))
        given(reportingRepository.findNbOfSuspicionOfOffense(mmsi)).willReturn(expectedSuspicionOfOffense)

        // When
        val suspicionOfOffense = getSuspicionOfOffenseByMmsi.execute(mmsi)

        // Then
        assertThat(suspicionOfOffense).isEqualTo(expectedSuspicionOfOffense)
        assertThat(log.out).contains("Attempt to find envAction with mmsi $mmsi")
        assertThat(log.out).contains("Found $suspicionOfOffense suspicions of offense.")
    }
}
