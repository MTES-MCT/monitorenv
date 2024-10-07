package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures.DashboardFixture.Companion.aDashboard
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock
import java.util.UUID

class SaveDashboardUTest {
    private val dashboardRepository: IDashboardRepository = mock()

    private val saveDashboard = SaveDashboard(dashboardRepository)

    @Test
    fun `execute should save dashboard and return saved dashboard`() {
        // Given
        val dashboard = aDashboard()
        val id = UUID.randomUUID()
        given(dashboardRepository.save(dashboard)).willReturn(aDashboard(id))

        // When
        val savedDashboard = saveDashboard.execute(dashboard)

        // Then
        assertThat(savedDashboard.id).isEqualTo(id)
        verify(dashboardRepository).save(dashboard)
    }
}
