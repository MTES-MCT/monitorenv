package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures.DashboardFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.Test
import org.mockito.Mockito
import java.util.*

class GetDashboardUTest {
    private val dashboardRepository: IDashboardRepository = Mockito.mock()
    private val getDashboard = GetDashboard(dashboardRepository)

    @Test
    fun `execute should return a dashboard`() {
        // Given
        val id = UUID.randomUUID()
        val dashboard =
            DashboardFixture.aDashboard(
                id = id,
                inseeCode = "94",
                amps = listOf(1),
                controlUnits = listOf(10000),
                reportings = listOf(1),
                regulatoryAreas = listOf(523),
                vigilanceAreas = listOf(1),
            )

        given(dashboardRepository.findById(id)).willReturn(dashboard)

        // When
        val dashboardResult = getDashboard.execute(id)

        // Then
        assertThat(dashboardResult).isEqualTo(dashboard)
    }
}
