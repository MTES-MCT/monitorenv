package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.util.UUID

@ExtendWith(OutputCaptureExtension::class)
class DeleteDashboardUTest {
    private val dashboardRepository: IDashboardRepository = Mockito.mock()
    private val deleteDashboard = DeleteDashboard(dashboardRepository)

    @Test
    fun `execute should delete dashboard`(log: CapturedOutput) {
        // Given
        val id = UUID.randomUUID()

        // When
        deleteDashboard.execute(id)

        // Then
        verify(dashboardRepository).delete(id)
        assertThat(log.out).contains("Attempt to DELETE dashboard $id")
        assertThat(log.out).contains("Dashboard $id deleted")
    }
}
