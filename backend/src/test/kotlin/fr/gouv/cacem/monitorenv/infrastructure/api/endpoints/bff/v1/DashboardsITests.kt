package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ExtractedAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.amp.fixtures.AmpFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.ExtractArea
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.GetDashboard
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.GetDashboards
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.SaveDashboard
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.fixtures.DashboardFixture.Companion.aDashboard
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryArea.fixtures.RegulatoryAreaFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures.VigilanceAreaFixture
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards.DashboardDataInput
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.*

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(Dashboards::class)])
class DashboardsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var extractArea: ExtractArea

    @MockBean
    private lateinit var saveDashboard: SaveDashboard

    @MockBean
    private lateinit var getDashboards: GetDashboards

    @MockBean
    private lateinit var getDashboard: GetDashboard

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should extract should response ok with reportings, regulatory areas, amps, vigilance area and departement that intersect the given geometry`() {
        // Given
        val geometry = "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"

        val reportings = listOf(ReportingFixture.aReportingDTO())
        val regulatoryAreas = listOf(RegulatoryAreaFixture.aRegulatoryArea())
        val amps = listOf(AmpFixture.anAmp())
        val vigilanceAreas = listOf(VigilanceAreaFixture.aVigilanceAreaEntity())
        given(extractArea.execute(WKTReader().read(geometry)))
            .willReturn(
                ExtractedAreaEntity(
                    inseeCode = "44",
                    reportings = reportings,
                    regulatoryAreas = regulatoryAreas,
                    amps = amps,
                    vigilanceAreas = vigilanceAreas,
                ),
            )

        // When
        mockMvc.perform(
            get("/bff/v1/dashboards/extract?geometry=$geometry")
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.inseeCode", equalTo("44")))
            .andExpect(jsonPath("$.reportings[0].id", equalTo(reportings[0].reporting.id)))
            .andExpect(jsonPath("$.regulatoryAreas[0].id", equalTo(regulatoryAreas[0].id)))
            .andExpect(jsonPath("$.amps[0].id", equalTo(amps[0].id)))
            .andExpect(jsonPath("$.vigilanceAreas[0].id", equalTo(vigilanceAreas[0].id)))
    }

    @Test
    fun `Should extract response should be ok when nothing intersect the given geometry`() {
        // Given
        val geometry = "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"

        val reportings: List<ReportingDTO> = listOf()
        val regulatoryAreas: List<RegulatoryAreaEntity> = listOf()
        val amps: List<AMPEntity> = listOf()
        val vigilanceAreas: List<VigilanceAreaEntity> = listOf()
        given(extractArea.execute(WKTReader().read(geometry)))
            .willReturn(
                ExtractedAreaEntity(
                    inseeCode = null,
                    reportings = reportings,
                    regulatoryAreas = regulatoryAreas,
                    amps = amps,
                    vigilanceAreas = vigilanceAreas,
                ),
            )

        // When
        mockMvc.perform(
            get("/bff/v1/dashboards/extract?geometry=$geometry")
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.inseeCode", equalTo(null)))
            .andExpect(jsonPath("$.reportings.size()", equalTo(0)))
            .andExpect(jsonPath("$.regulatoryAreas.size()", equalTo(0)))
            .andExpect(jsonPath("$.amps.size()", equalTo(0)))
            .andExpect(jsonPath("$.vigilanceAreas.size()", equalTo(0)))
    }

    @Test
    fun `Should extract response should be bad request if the given geometry is not valid`() {
        // Given
        val geometry = "Wrong geometry param"

        // When
        mockMvc.perform(
            get("/bff/v1/dashboards/extract?geometry=$geometry")
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(status().isBadRequest)
            .andExpect(jsonPath("$.message", equalTo("Error: geometry is not valid")))
    }

    @Test
    fun `Should put response should be ok with and return the saved dashboard`() {
        // Given
        val id = UUID.randomUUID()
        val name = "dashboard1"
        val comments = "comments"
        val geometry = WKTReader().read("MULTIPOINT ((-1.548 44.315),(-1.245 44.305))")
        val amps = listOf(1)
        val regulatoryAreas = listOf(2)
        val vigilanceAreas = listOf(3)
        val reportings = listOf(4)
        val controlUnits = listOf(4)
        val inseeCode = "94"
        val createdAt = ZonedDateTime.parse("2024-01-01T00:00Z")
        val updatedAt = ZonedDateTime.parse("2024-01-02T00:00Z")
        val input =
            DashboardDataInput(
                id = id,
                name = name,
                comments = comments,
                createdAt = createdAt,
                updatedAt = updatedAt,
                geom = geometry,
                inseeCode = inseeCode,
                amps = amps,
                regulatoryAreas = regulatoryAreas,
                vigilanceAreas = vigilanceAreas,
                reportings = reportings,
                controlUnits = controlUnits,
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
            )
        given(saveDashboard.execute(dashboard)).willReturn(dashboard)

        // When
        mockMvc.perform(
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
            )
            .andExpect(
                jsonPath(
                    "$.updatedAt",
                    equalTo(updatedAt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)),
                ),
            )
            .andExpect(jsonPath("$.inseeCode", equalTo(inseeCode)))
            .andExpect(jsonPath("$.amps", equalTo(amps)))
            .andExpect(jsonPath("$.regulatoryAreas", equalTo(regulatoryAreas)))
            .andExpect(jsonPath("$.reportings", equalTo(reportings)))
            .andExpect(jsonPath("$.vigilanceAreas", equalTo(vigilanceAreas)))
            .andExpect(jsonPath("$.controlUnits", equalTo(controlUnits)))
    }

    @Test
    fun `Should getAll response should return dashboards list`() {
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
        mockMvc.perform(
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
    fun `Should get specific dashboard when requested by Id`() {
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
        mockMvc.perform(
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
            .andExpect(jsonPath("$.amps", equalTo(dashboard.amps)))
            .andExpect(jsonPath("$.regulatoryAreas", equalTo(dashboard.regulatoryAreas)))
            .andExpect(jsonPath("$.reportings", equalTo(dashboard.reportings)))
            .andExpect(jsonPath("$.vigilanceAreas", equalTo(dashboard.vigilanceAreas)))
    }
}
