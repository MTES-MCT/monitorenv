package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SuspicionOfInfractions
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetSuspicionOfInfractionsByMmsiUTest {
    private val reportingRepository: IReportingRepository = mock()

    val getSuspicionOfInfractionsByMmsi = GetSuspicionOfInfractionsByMmsi(reportingRepository)

    @Test
    fun `execute should return nb of suspicion of infractions with given MMSI`(log: CapturedOutput) {
        // Given
        val mmsi = "0123456789"
        val idToExclude = 1
        val expectedSuspicionOfInfractions = SuspicionOfInfractions(arrayOf(1, 2), arrayOf("themes"))
        given(reportingRepository.findSuspicionOfInfractionsByMmsi(mmsi, idToExclude)).willReturn(
            expectedSuspicionOfInfractions,
        )

        // When
        val suspicionOfInfraction = getSuspicionOfInfractionsByMmsi.execute(mmsi, idToExclude)

        // Then
        assertThat(suspicionOfInfraction).isEqualTo(expectedSuspicionOfInfractions)
        assertThat(log.out).contains("Attempt to find suspicions of infraction with mmsi $mmsi")
        assertThat(log.out).contains("Found 2 suspicions of infraction.")
    }
}
