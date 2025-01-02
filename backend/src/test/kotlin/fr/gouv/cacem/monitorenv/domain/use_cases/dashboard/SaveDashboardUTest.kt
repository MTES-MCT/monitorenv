package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IDashboardRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IFacadeAreasRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures.DashboardFixture.Companion.aDashboard
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.util.UUID

@ExtendWith(OutputCaptureExtension::class)
class SaveDashboardUTest {
    private val dashboardRepository: IDashboardRepository = mock()
    private val facadeAreasRepository: IFacadeAreasRepository = mock()

    private val saveDashboard = SaveDashboard(dashboardRepository, facadeAreasRepository)

    @Test
    fun `execute should find its sea front then save dashboard and return saved dashboard`(log: CapturedOutput) {
        // Given
        val dashboard = aDashboard()
        val id = UUID.randomUUID()
        val seaFront = "MED"
        given(facadeAreasRepository.findFacadeFromGeometry(dashboard.geom)).willReturn(seaFront)
        val dashboardWithFacade = dashboard.copy(seaFront = seaFront)
        given(dashboardRepository.save(dashboardWithFacade)).willReturn(dashboardWithFacade.copy(id = id))

        // When
        val savedDashboard = saveDashboard.execute(dashboard)

        // Then
        assertThat(savedDashboard.id).isEqualTo(id)
        verify(dashboardRepository).save(dashboardWithFacade)
        verify(facadeAreasRepository).findFacadeFromGeometry(dashboard.geom)

        assertThat(log.out).contains("Attempt to CREATE or UPDATE dashboard ${dashboard.id}")
        assertThat(log.out).contains("Dashboard ${savedDashboard.id} created or updated")
    }

    @Test
    fun `execute should throw a BackendUsageException when an error occured`() {
        // Given
        val dashboard = aDashboard()
        given(dashboardRepository.save(dashboard)).willThrow(IllegalArgumentException::class.java)

        // When
        val backendUsageException = assertThrows<BackendUsageException> { saveDashboard.execute(dashboard) }

        // Then
        assertThat(backendUsageException.code).isEqualTo(BackendUsageErrorCode.ENTITY_NOT_SAVED)
        assertThat(backendUsageException.message).isEqualTo("dashboard ${dashboard.id} couldn't be saved")
    }
}
