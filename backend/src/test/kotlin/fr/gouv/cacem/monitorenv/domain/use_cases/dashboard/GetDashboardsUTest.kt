package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures.DashboardFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.verify
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetDashboardsUTest {
    private val dashboardRepository: IDashboardRepository = mock()
    private val getDashboards = GetDashboards(dashboardRepository)

    @Test
    fun `execute should return all dashboards`(log: CapturedOutput) {
        // Given
        val dashboard1 =
            DashboardFixture.aDashboard(
                inseeCode = "94",
                amps = listOf(1),
                controlUnits = listOf(10000),
                reportings = listOf(1),
                regulatoryAreas = listOf(523),
                vigilanceAreas = listOf(1),
            )
        val dashboard2 =
            DashboardFixture.aDashboard(
                inseeCode = "44",
                amps = listOf(1, 2),
                controlUnits = listOf(10000),
                reportings = listOf(1, 12),
                regulatoryAreas = listOf(7),
                vigilanceAreas = listOf(),
            )
        val dashboards =
            listOf(
                dashboard1,
                dashboard2,
            )

        given(dashboardRepository.findAll()).willReturn(dashboards)

        // When
        val dashboardList = getDashboards.execute()

        // Then
        assertThat(dashboardList.size).isEqualTo(2)
        assertThat(log.out).contains("Attempt to GET all dashboards")
        assertThat(log.out).contains("Found ${dashboardList.size} dashboards")
    }

    @Test
    fun `execute should return empty list if no dashboards`() {
        // Given
        val dashboards = emptyList<DashboardEntity>()

        // When
        val dashboardList = getDashboards.execute()

        // Then
        assertEquals(dashboards, dashboardList)
        verify(dashboardRepository).findAll()
    }
}
