package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class ArchiveOutdatedReportingsUTest {
    private val reportingRepository: IReportingRepository = mock()
    private val archiveOutdatedReportings = ArchiveOutdatedReportings(reportingRepository)

    @Test
    fun `execute should archive reportings`(log: CapturedOutput) {
        // Given
        given(reportingRepository.archiveOutdatedReportings()).willReturn(2)

        // When
        archiveOutdatedReportings.execute()

        // Then
        assertThat(log.out).contains("Attempt to ARCHIVE reportings")
        assertThat(log.out).contains("2 reportings archived")
    }
}
