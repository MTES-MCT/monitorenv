package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.LinkEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures.DashboardFixture.Companion.aDashboard
import io.ktor.util.*
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

class JpaDashboardRepositoryITests : AbstractDBTests() {
    @Autowired
    private lateinit var jpaDashboardRepository: JpaDashboardRepository

    @Test
    fun `save should save a dashboard and return saved entity when dashboard doesnt exist`() {
        // Given
        val dashboard = aDashboard()

        // When
        val savedDashboard = jpaDashboardRepository.save(dashboard)

        // Then
        assertThat(savedDashboard.id).isNotNull()
        assertThat(savedDashboard.createdAt).isNotNull()
        assertThat(savedDashboard.updatedAt).isNull()
        assertThat(savedDashboard).usingRecursiveComparison().ignoringFields("id", "createdAt").isEqualTo(dashboard)
    }

    @Test
    fun `save should save a dashboard with amps, control units, reportings, regulatory areas and vigilance areas and return saved entity when dashboard doesnt exist`() {
        // Given
        val dashboard =
            aDashboard(
                inseeCode = "94",
                seaFront = "MED",
                amps = listOf(1),
                controlUnits = listOf(10000),
                reportings = listOf(1),
                regulatoryAreas = listOf(523),
                vigilanceAreas = listOf(1),
            )

        // When
        val savedDashboard = jpaDashboardRepository.save(dashboard)

        // Then
        assertThat(savedDashboard.id).isNotNull()
        assertThat(savedDashboard.createdAt).isNotNull()
        assertThat(savedDashboard.updatedAt).isNull()
        assertThat(savedDashboard).usingRecursiveComparison().ignoringFields("id", "createdAt").isEqualTo(dashboard)
    }

    @Test
    fun `save should update a dashboard and return saved entity when dashboard exist`() {
        // Given
        val dashboard =
            aDashboard(
                inseeCode = "94",
                amps = listOf(1),
                controlUnits = listOf(10000),
                reportings = listOf(1),
                regulatoryAreas = listOf(523),
                vigilanceAreas = listOf(1),
                links =
                    listOf(
                        LinkEntity(linkUrl = "https://www.google.fr", linkText = "google"),
                        LinkEntity(linkUrl = "https://www.yahoo.fr", linkText = "yahoo"),
                    ),
                images =
                    listOf(
                        ImageEntity(
                            id = null,
                            name = "image1",
                            content = "content1".decodeBase64Bytes(),
                            dashboardId = null,
                            size = 1,
                            mimeType = MediaType.IMAGE_JPEG.toString(),
                        ),
                    ),
            )
        val createdDashboard = jpaDashboardRepository.save(dashboard)

        val name = "updatedDashboard"
        val comments = "updated comments"
        val geom = WKTReader().read("MULTIPOINT ((-1.555 44.315),(-1.555 44.305))")
        val inseeCode = "94"
        val amps = listOf(1, 2)
        val reportings = listOf(1, 2)
        val regulatoryAreas = listOf(522, 523)
        val vigilanceAreas = listOf(1, 2)
        val controlUnits = listOf(10000, 10001)

        val dashboardToUpdate =
            createdDashboard.copy(
                name = name,
                comments = comments,
                geom = geom,
                inseeCode = inseeCode,
                ampIds = amps,
                controlUnitIds = controlUnits,
                regulatoryAreaIds = regulatoryAreas,
                reportingIds = reportings,
                vigilanceAreaIds = vigilanceAreas,
                links = listOf(),
                images = listOf(),
            )

        // When
        val updatedDashboard = jpaDashboardRepository.save(dashboardToUpdate)

        // Then
        assertThat(updatedDashboard.updatedAt).isNotNull()
        assertThat(updatedDashboard).usingRecursiveComparison().ignoringFields("updatedAt").isEqualTo(dashboardToUpdate)
    }

    @Test
    @Transactional
    fun `findAll should return all dashboards`() {
        // When
        val dashboards = jpaDashboardRepository.findAll()

        // Then
        assertThat(dashboards).hasSize(7)
    }

    @Test
    @Transactional
    fun `delete should update set deleted to true`() {
        // Given
        val id = UUID.fromString("e1e99b92-1e61-4f9f-9cbf-8cfae2395d41")
        assertThat(jpaDashboardRepository.findById(id)?.isDeleted).isFalse()

        // When
        jpaDashboardRepository.delete(id)

        // Then
        assertThat(jpaDashboardRepository.findById(id)?.isDeleted).isTrue()
    }
}
