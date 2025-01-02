package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class ArchiveReportingsUTest {
    private val reportingRepository: IReportingRepository = mock()
    private val archiveReportings = ArchiveReportings(reportingRepository)

    @Test
    fun `execute should archive reportings`(log: CapturedOutput) {
        // Given
        val ids = listOf(1, 2)

        // When
        archiveReportings.execute(ids)

        // Then
        verify(reportingRepository).archiveReportings(ids)
        assertThat(log.out).contains("Attempt to ARCHIVE reportings $ids")
        assertThat(log.out).contains("reportings $ids archived")
    }
}
