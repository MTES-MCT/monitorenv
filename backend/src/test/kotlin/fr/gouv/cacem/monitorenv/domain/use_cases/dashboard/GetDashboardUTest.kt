package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures.DashboardFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.util.UUID

@ExtendWith(OutputCaptureExtension::class)
class GetDashboardUTest {
    private val dashboardRepository: IDashboardRepository = Mockito.mock()
    private val getDashboard = GetDashboard(dashboardRepository)

    @Test
    fun `execute should return a dashboard`(log: CapturedOutput) {
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

        assertThat(log.out).contains("GET dashboard ${dashboard.id}")
    }
}
