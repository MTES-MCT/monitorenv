package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures.DashboardFixture.Companion.aDashboard
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired

class JpaDashboardRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaDashboardRepository: JpaDashboardRepository

    @Test
    fun `save should delete all his briefings then save a dashboard and return saved entity when dashboard doesnt exist`() {
        // Given
        val dashboard = aDashboard()

        // When
        val savedDashboard = jpaDashboardRepository.save(dashboard)

        // Then
        assertThat(savedDashboard.id).isNotNull()
    }

    @Test
    fun `save should save a dashboard with amps and return saved entity when dashboard doesnt exist`() {
        // Given
        val amps = listOf(1)
        val dashboard = aDashboard(amps = amps)

        // When
        val savedDashboard = jpaDashboardRepository.save(dashboard)

        // Then
        assertThat(savedDashboard.id).isNotNull()
        assertThat(savedDashboard.amps).isEqualTo(amps)
    }

    @Test
    fun `save should save a dashboard with regulatory areas and return saved entity when dashboard doesnt exist`() {
        // Given
        val regulatoryAreas = listOf(523)
        val dashboard = aDashboard(regulatoryAreas = regulatoryAreas)

        // When
        val savedDashboard = jpaDashboardRepository.save(dashboard)

        // Then
        assertThat(savedDashboard.id).isNotNull()
        assertThat(savedDashboard.regulatoryAreas).isEqualTo(regulatoryAreas)
    }

    @Test
    fun `save should save a dashboard with reportings and return saved entity when dashboard doesnt exist`() {
        // Given
        val reportings = listOf(1)
        val dashboard = aDashboard(reportings = reportings)

        // When
        val savedDashboard = jpaDashboardRepository.save(dashboard)

        // Then
        assertThat(savedDashboard.id).isNotNull()
        assertThat(savedDashboard.reportings).isEqualTo(reportings)
    }

    @Test
    fun `save should save a dashboard with vigilance areas and return saved entity when dashboard doesnt exist`() {
        // Given
        val vigilanceAreas = listOf(1)
        val dashboard = aDashboard(vigilanceAreas = vigilanceAreas)

        // When
        val savedDashboard = jpaDashboardRepository.save(dashboard)

        // Then
        assertThat(savedDashboard.id).isNotNull()
        assertThat(savedDashboard.vigilanceAreas).isEqualTo(vigilanceAreas)
    }

    @Test
    fun `save should save a dashboard with an insee code and return saved entity when dashboard doesnt exist`() {
        // Given
        val inseeCode = "94"
        val dashboard = aDashboard(inseeCode = inseeCode)

        // When
        val savedDashboard = jpaDashboardRepository.save(dashboard)

        // Then
        assertThat(savedDashboard.id).isNotNull()
        assertThat(savedDashboard.inseeCode).isEqualTo(inseeCode)
    }

    @Test
    fun `save should update a dashboard and return saved entity when dashboard exist`() {
        // Given
        val dashboard = aDashboard()
        var createdDashboard = jpaDashboardRepository.save(dashboard)
        assertThat(createdDashboard.reportings).isEmpty()
        assertThat(createdDashboard.amps).isEmpty()
        assertThat(createdDashboard.reportings).isEmpty()
        assertThat(createdDashboard.regulatoryAreas).isEmpty()

        val name = "updatedDashboard"
        val geom = WKTReader().read("MULTIPOINT ((-1.555 44.315),(-1.555 44.305))")
        val inseeCode = "94"
        val amps = listOf(1)
        val reportings = listOf(1)
        val regulatoryAreas = listOf(523)
        val vigilanceAreas = listOf(1)
        createdDashboard =
            createdDashboard.copy(
                name = name,
                geom = geom,
                inseeCode = inseeCode,
                amps = amps,
                reportings = reportings,
                regulatoryAreas = regulatoryAreas,
                vigilanceAreas = vigilanceAreas,
            )

        // When
        val updatedDashboard = jpaDashboardRepository.save(createdDashboard)

        // Then
        assertThat(updatedDashboard.id).isEqualTo(createdDashboard.id)
        assertThat(updatedDashboard.name).isEqualTo(name)
        assertThat(updatedDashboard.geom).isEqualTo(geom)
        assertThat(updatedDashboard.inseeCode).isEqualTo(inseeCode)
        assertThat(updatedDashboard.amps).isEqualTo(amps)
        assertThat(updatedDashboard.reportings).isEqualTo(reportings)
        assertThat(updatedDashboard.regulatoryAreas).isEqualTo(regulatoryAreas)
        assertThat(updatedDashboard.vigilanceAreas).isEqualTo(vigilanceAreas)
    }
}
