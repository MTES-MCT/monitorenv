package fr.gouv.cacem.monitorenv.domain.use_cases.dashboard

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefFileEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefRecentActivityEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.file.dashboard.IDashboardFile
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.OutputCaptureExtension
import java.util.UUID

@ExtendWith(OutputCaptureExtension::class)
class CreateBriefUTest {
    private val dashboardFile: IDashboardFile = mock()
    private val createBrief = CreateBrief(dashboardFile)

    val wktReader = WKTReader()
    val multipolygonString =
        "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
    val polygon = wktReader.read(multipolygonString) as MultiPolygon

    @Test
    fun `execute should return a Brief file`() {
        // Given
        val brief =
            BriefEntity(
                dashboard =
                    DashboardEntity(
                        id = UUID.randomUUID(),
                        inseeCode = "94",
                        ampIds = listOf(1),
                        controlUnitIds = listOf(10000),
                        reportingIds = listOf(1),
                        regulatoryAreaIds = listOf(523),
                        vigilanceAreaIds = listOf(1),
                        name = "Test Dashboard",
                        geom = polygon,
                        comments = "Test comments",
                        createdAt = null,
                        updatedAt = null,
                        seaFront = "MENM",
                        links = emptyList(),
                        images = emptyList(),
                    ),
                amps = emptyList(),
                reportings = emptyList(),
                vigilanceAreas = emptyList(),
                regulatoryAreas = emptyList(),
                nearbyUnits = emptyList(),
                recentActivity = EditableBriefRecentActivityEntity(null, null, "toto", emptyList(), emptyList()),
            )

        given(dashboardFile.createEditableBrief(brief)).willReturn(
            BriefFileEntity(
                fileName = "Brief-Test Dashboard.odt",
                fileContent = "base64Content",
            ),
        )

        // When
        val briefFileResult = createBrief.execute(brief)
        println("briefFileResult $briefFileResult")
        // Then
        assertThat(briefFileResult).isNotNull
        assertThat(briefFileResult).isInstanceOf(BriefFileEntity::class.java)
    }

    @Test
    fun `execute should throw an error if create brief failed`() {
        // Given
        val id = UUID.randomUUID()
        val brief =
            BriefEntity(
                dashboard =
                    DashboardEntity(
                        id = id,
                        inseeCode = "94",
                        ampIds = listOf(1),
                        controlUnitIds = listOf(10000),
                        reportingIds = listOf(1),
                        regulatoryAreaIds = listOf(523),
                        vigilanceAreaIds = listOf(1),
                        name = "Test Dashboard",
                        geom = polygon,
                        comments = "Test comments",
                        createdAt = null,
                        updatedAt = null,
                        seaFront = "MENM",
                        links = emptyList(),
                        images = emptyList(),
                    ),
                amps = emptyList(),
                reportings = emptyList(),
                vigilanceAreas = emptyList(),
                regulatoryAreas = emptyList(),
                nearbyUnits = emptyList(),
                recentActivity = EditableBriefRecentActivityEntity(null, null, "toto", emptyList(), emptyList()),
            )
        given(dashboardFile.createEditableBrief(brief)).willThrow(IllegalArgumentException::class.java)

        // When
        val backendUsageException = assertThrows<BackendUsageException> { createBrief.execute(brief) }

        // Then
        assertThat(backendUsageException.code).isEqualTo(BackendUsageErrorCode.ENTITY_NOT_SAVED)
        assertThat(backendUsageException.message).isEqualTo("Brief with id $id couldn't be created")
    }
}
