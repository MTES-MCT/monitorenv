package fr.gouv.cacem.monitorenv.domain.use_cases.reportings

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture.Companion.aReportingDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock

class GetReportingsByIdsUTest {
    private val reportingRepository: IReportingRepository = mock()

    private val getReportingsByIds = GetReportingsByIds(reportingRepository)

    @Test
    fun `execute should retrieve reportings that match ids`() {
        // Given
        val ids = listOf(1, 2, 3)
        val reportings = listOf(aReportingDTO(id = 1), aReportingDTO(id = 2), aReportingDTO(id = 3))
        given(reportingRepository.findAllById(ids)).willReturn(reportings)

        // When
        val reportingDTOS = getReportingsByIds.execute(ids)

        // Then
        assertThat(reportingDTOS).isEqualTo(reportings)
    }

    @Test
    fun `execute should return emptyList when there are no ids provided`() {
        // Given
        val ids: List<Int> = listOf()
        given(reportingRepository.findAllById(ids)).willReturn(emptyList())

        // When
        val reportingDTOS = getReportingsByIds.execute(ids)

        // Then
        assertThat(reportingDTOS).isEmpty()
    }
}
