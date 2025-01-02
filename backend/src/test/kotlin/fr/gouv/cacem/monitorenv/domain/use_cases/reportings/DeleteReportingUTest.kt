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
class DeleteReportingUTest {
    private val reportingRepository: IReportingRepository = mock()
    private val deleteReporting = DeleteReporting(reportingRepository)

    @Test
    fun `execute should delete reporting`(log: CapturedOutput) {
        // Given
        val id = 1

        // When
        deleteReporting.execute(id)

        // Then
        verify(reportingRepository).delete(id)
        assertThat(log.out).contains("Attempt to DELETE reporting $id")
        assertThat(log.out).contains("reporting $id deleted")
    }
}
