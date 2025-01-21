package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingListDTO
import io.mockk.every
import io.mockk.mockkStatic
import io.mockk.unmockkStatic
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class GetReportingsUTest {
    private val reportingRepository: IReportingRepository = mock()

    private val getReportings = GetReportings(reportingRepository)

    @Test
    fun `execute should retrieve all reportings with given criteria`(log: CapturedOutput) {
        // Given
        val now = ZonedDateTime.now()
        val reportings = listOf(aReportingListDTO(id = 1), aReportingListDTO(id = 2), aReportingListDTO(id = 3))
        given(
            reportingRepository.findAll(
                pageNumber = null,
                pageSize = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                startedAfter = now.toInstant(),
                startedBefore = null,
                status = null,
                targetTypes = null,
                isAttachedToMission = null,
                searchQuery = null,
            ),
        ).willReturn(reportings)

        // When
        val reportingDTOS =
            getReportings.execute(
                pageNumber = null,
                pageSize = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                startedAfterDateTime = now,
                startedBeforeDateTime = null,
                status = null,
                targetTypes = null,
                isAttachedToMission = null,
                searchQuery = null,
            )

        // Then
        assertThat(reportingDTOS).isEqualTo(reportings)
        assertThat(log.out).contains("Attempt to get reportings with criteria")
        assertThat(log.out).contains("Found ${reportings.size} reportings with criteria")
    }

    @Test
    fun `execute should retrieve all reportings within 30 days when there is no started date criteria`(
        log: CapturedOutput,
    ) {
        // Given
        val reportings = listOf(aReportingListDTO(id = 1), aReportingListDTO(id = 2), aReportingListDTO(id = 3))

        val now = ZonedDateTime.now()
        mockkStatic(ZonedDateTime::class)
        every { ZonedDateTime.now() } returns now

        given(
            reportingRepository.findAll(
                pageNumber = null,
                pageSize = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                startedAfter = now.minusDays(30).toInstant(),
                startedBefore = null,
                status = null,
                targetTypes = null,
                isAttachedToMission = null,
                searchQuery = null,
            ),
        ).willReturn(reportings)

        // When
        val reportingDTOS =
            getReportings.execute(
                pageNumber = null,
                pageSize = null,
                reportingType = null,
                seaFronts = null,
                sourcesType = null,
                startedAfterDateTime = null,
                startedBeforeDateTime = null,
                status = null,
                targetTypes = null,
                isAttachedToMission = null,
                searchQuery = null,
            )

        // Then
        assertThat(reportingDTOS).isEqualTo(reportings)
        unmockkStatic(ZonedDateTime::class)
    }
}
