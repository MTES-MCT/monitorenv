package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetReportingByIdUTest {
    private val reportingRepository: IReportingRepository = mock()

    private val getReportingById = GetReportingById(reportingRepository)

    @Test
    fun `execute should get reporting with given id`(log: CapturedOutput) {
        // Given
        val id = 1
        val expectedReportingDTO = aReportingDTO(id = id)
        given(reportingRepository.findById(id)).willReturn(expectedReportingDTO)

        // When
        val reportingDTO = getReportingById.execute(id)

        // Then
        assertThat(expectedReportingDTO).isEqualTo(reportingDTO)
        assertThat(log.out).contains("GET reporting $id")
    }
}
