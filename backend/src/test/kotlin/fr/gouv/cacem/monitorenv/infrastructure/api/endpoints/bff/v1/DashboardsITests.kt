package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ExtractedAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.LinkEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.DeleteDashboard
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.ExtractArea
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.GetDashboard
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.GetDashboards
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.SaveDashboard
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures.DashboardFixture.Companion.aDashboard
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards.DashboardDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards.ImageDataInput
import io.ktor.util.*
import org.hamcrest.Matchers.equalTo
import org.hamcrest.Matchers.hasSize
import org.junit.jupiter.api.Test
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(Dashboards::class)])
class DashboardsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var extractArea: ExtractArea

    @MockitoBean
    private lateinit var saveDashboard: SaveDashboard

    @MockitoBean
    private lateinit var getDashboards: GetDashboards

    @MockitoBean
    private lateinit var getDashboard: GetDashboard

    @MockitoBean
    private lateinit var deleteDashboard: DeleteDashboard

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    val geometry = "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"

    @Test
    fun `extract should response ok with reportings, regulatory areas, amps, vigilance area and departement that intersect the given geometry`() {
        // Given
        val geometry = "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"

        val reportings = listOf(1)
        val regulatoryAreas = listOf(2)
        val amps = listOf(3)
        val vigilanceAreas = listOf(4)
        given(extractArea.execute(WKTReader().read(geometry)))
            .willReturn(
                ExtractedAreaEntity(
                    inseeCode = "44",
                    reportingIds = reportings,
                    regulatoryAreaIds = regulatoryAreas,
                    ampIds = amps,
                    vigilanceAreaIds = vigilanceAreas,
                ),
            )

        // When
        mockMvc
            .perform(
                get("/bff/v1/dashboards/extract?geometry=$geometry")
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.inseeCode", equalTo("44")))
            .andExpect(jsonPath("$.reportingIds[0]", equalTo(reportings[0])))
            .andExpect(jsonPath("$.regulatoryAreaIds[0]", equalTo(regulatoryAreas[0])))
            .andExpect(jsonPath("$.ampIds[0]", equalTo(amps[0])))
            .andExpect(jsonPath("$.vigilanceAreaIds[0]", equalTo(vigilanceAreas[0])))
    }

    @Test
    fun `extract response should be ok when nothing intersect the given geometry`() {
        // Given
        val geometry = "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"

        val reportings: List<Int> = listOf()
        val regulatoryAreas: List<Int> = listOf()
        val amps: List<Int> = listOf()
        val vigilanceAreas: List<Int> = listOf()
        given(extractArea.execute(WKTReader().read(geometry)))
            .willReturn(
                ExtractedAreaEntity(
                    inseeCode = null,
                    reportingIds = reportings,
                    regulatoryAreaIds = regulatoryAreas,
                    ampIds = amps,
                    vigilanceAreaIds = vigilanceAreas,
                ),
            )

        // When
        mockMvc
            .perform(
                get("/bff/v1/dashboards/extract?geometry=$geometry")
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.inseeCode", equalTo(null)))
            .andExpect(jsonPath("$.reportingIds.size()", equalTo(0)))
            .andExpect(jsonPath("$.regulatoryAreaIds.size()", equalTo(0)))
            .andExpect(jsonPath("$.ampIds.size()", equalTo(0)))
            .andExpect(jsonPath("$.vigilanceAreaIds.size()", equalTo(0)))
    }

    @Test
    fun `extract response should be bad request if the given geometry is not valid`() {
        // Given
        val geometry = "Wrong geometry param"

        // When
        mockMvc
            .perform(
                get("/bff/v1/dashboards/extract?geometry=$geometry")
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.message", equalTo("Error: geometry is not valid")))
    }

    @Test
    fun `put response should be ok with and return the saved dashboard`() {
        // Given
        val id = UUID.randomUUID()
        val name = "dashboard1"
        val comments = "comments"
        val geometry = WKTReader().read(geometry)
        val amps = listOf(1)
        val regulatoryAreas = listOf(2)
        val vigilanceAreas = listOf(3)
        val reportings = listOf(4)
        val controlUnits = listOf(4)
        val inseeCode = "94"
        val createdAt = ZonedDateTime.parse("2024-01-01T00:00Z")
        val updatedAt = ZonedDateTime.parse("2024-01-02T00:00Z")
        val links =
            listOf(
                LinkEntity(linkUrl = "https://www.google.fr", linkText = "google"),
                LinkEntity(linkUrl = "https://www.yahoo.fr", linkText = "yahoo"),
            )
        val imageId = UUID.randomUUID()
        val images =
            listOf(
                ImageDataInput(
                    id = imageId,
                    name = "image1",
                    content = "content1",
                    mimeType = MediaType.IMAGE_JPEG.toString(),
                    size = 1,
                ),
            )
        val input =
            DashboardDataInput(
                id = id,
                name = name,
                comments = comments,
                createdAt = createdAt,
                updatedAt = updatedAt,
                geom = geometry,
                inseeCode = inseeCode,
                ampIds = amps,
                regulatoryAreaIds = regulatoryAreas,
                vigilanceAreaIds = vigilanceAreas,
                reportingIds = reportings,
                controlUnitIds = controlUnits,
                links = links,
                images = images,
            )
        val dashboard =
            aDashboard(
                id = id,
                name = name,
                comments = comments,
                geom = geometry,
                createdAt = createdAt,
                updatedAt = updatedAt,
                amps = amps,
                vigilanceAreas = vigilanceAreas,
                reportings = reportings,
                regulatoryAreas = regulatoryAreas,
                inseeCode = inseeCode,
                controlUnits = controlUnits,
                links = links,
                images =
                    listOf(
                        ImageEntity(
                            id = imageId,
                            name = "image1",
                            content = "content1".decodeBase64Bytes(),
                            size = 1,
                            mimeType = MediaType.IMAGE_JPEG.toString(),
                        ),
                    ),
            )
        given(saveDashboard.execute(dashboard)).willReturn(dashboard)

        // When
        mockMvc
            .perform(
                put("/bff/v1/dashboards")
                    .content(objectMapper.writeValueAsString(input))
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(id.toString())))
            .andExpect(jsonPath("$.name", equalTo(name)))
            .andExpect(jsonPath("$.comments", equalTo(comments)))
            .andExpect(jsonPath("$.geom.type", equalTo(geometry.geometryType)))
            .andExpect(
                jsonPath(
                    "$.createdAt",
                    equalTo(createdAt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)),
                ),
            ).andExpect(
                jsonPath(
                    "$.updatedAt",
                    equalTo(updatedAt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)),
                ),
            ).andExpect(jsonPath("$.inseeCode", equalTo(inseeCode)))
            .andExpect(jsonPath("$.ampIds", equalTo(amps)))
            .andExpect(jsonPath("$.regulatoryAreaIds", equalTo(regulatoryAreas)))
            .andExpect(jsonPath("$.reportingIds", equalTo(reportings)))
            .andExpect(jsonPath("$.vigilanceAreaIds", equalTo(vigilanceAreas)))
            .andExpect(jsonPath("$.controlUnitIds", equalTo(controlUnits)))
            .andExpect(jsonPath("$.links", hasSize<Int>(2)))
            .andExpect(jsonPath("$.links[0].linkUrl", equalTo("https://www.google.fr")))
            .andExpect(jsonPath("$.links[0].linkText", equalTo("google")))
            .andExpect(jsonPath("$.links[1].linkUrl", equalTo("https://www.yahoo.fr")))
            .andExpect(jsonPath("$.links[1].linkText", equalTo("yahoo")))
            .andExpect(jsonPath("$.images", hasSize<Int>(1)))
            .andExpect(jsonPath("$.images[0].id", equalTo(imageId.toString())))
            .andExpect(jsonPath("$.images[0].name", equalTo("image1")))
            .andExpect(jsonPath("$.images[0].content", equalTo("content1")))
            .andExpect(jsonPath("$.images[0].size", equalTo(1)))
            .andExpect(jsonPath("$.images[0].mimeType", equalTo(MediaType.IMAGE_JPEG.toString())))
    }

    @Test
    fun `getAll response should return dashboards list`() {
        // Given
        val dashboard1 =
            aDashboard(
                id = UUID.randomUUID(),
            )
        val dashboard2 =
            aDashboard(
                id = UUID.randomUUID(),
            )
        val dashboards = listOf(dashboard1, dashboard2)
        given(getDashboards.execute()).willReturn(dashboards)

        // When
        mockMvc
            .perform(
                get("/bff/v1/dashboards").contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(dashboard1.id.toString())))
            .andExpect(
                jsonPath("$[1].id", equalTo(dashboard2.id.toString())),
            )
    }

    @Test
    fun `get specific dashboard when requested by Id`() {
        // Given
        val id = UUID.randomUUID()
        val dashboard =
            aDashboard(
                id = id,
                inseeCode = "44",
                amps = listOf(1),
                controlUnits = listOf(10000),
                reportings = listOf(1, 2, 3),
                regulatoryAreas = listOf(523),
                vigilanceAreas = listOf(1),
            )
        given(getDashboard.execute(id)).willReturn(dashboard)

        // When
        mockMvc
            .perform(
                get("/bff/v1/dashboards/$id").contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(id.toString())))
            .andExpect(jsonPath("$.name", equalTo(dashboard.name)))
            .andExpect(jsonPath("$.comments", equalTo(dashboard.comments)))
            .andExpect(jsonPath("$.geom.type", equalTo(dashboard.geom.geometryType)))
            .andExpect(jsonPath("$.createdAt", equalTo(dashboard.createdAt)))
            .andExpect(jsonPath("$.updatedAt", equalTo(dashboard.updatedAt)))
            .andExpect(jsonPath("$.inseeCode", equalTo(dashboard.inseeCode)))
            .andExpect(jsonPath("$.ampIds", equalTo(dashboard.ampIds)))
            .andExpect(jsonPath("$.regulatoryAreaIds", equalTo(dashboard.regulatoryAreaIds)))
            .andExpect(jsonPath("$.reportingIds", equalTo(dashboard.reportingIds)))
            .andExpect(jsonPath("$.vigilanceAreaIds", equalTo(dashboard.vigilanceAreaIds)))
            .andExpect(jsonPath("$.controlUnitIds", equalTo(dashboard.controlUnitIds)))
    }

    @Test
    fun `delete response should be OK`() {
        // Given
        val id = UUID.randomUUID()

        // When
        mockMvc
            .perform(
                delete("/bff/v1/dashboards/$id").contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)

        verify(deleteDashboard).execute(id)
    }
}
