package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import java.util.UUID

class DeleteDashboardUTest {
    private val dashboardRepository: IDashboardRepository = Mockito.mock()
    private val deleteDashboard = DeleteDashboard(dashboardRepository)

    @Test
    fun `execute should delete dashboard`() {
        // Given
        val id = UUID.randomUUID()

        // When
        deleteDashboard.execute(id)

        // Then
        verify(dashboardRepository).delete(id)
    }
}
