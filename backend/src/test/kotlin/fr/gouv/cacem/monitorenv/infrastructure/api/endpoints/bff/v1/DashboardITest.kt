package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ExtractedAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.amp.fixtures.AmpFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.dashboard.ExtractArea
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryArea.fixtures.RegulatoryAreaFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures.VigilanceAreaFixture
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
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(Dashboard::class)])
class DashboardITest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var extractArea: ExtractArea

    @Test
    fun `extract should retrieve reportings, regulatory areas, amps, vigilance area and departement that intersect the given geometry`() {
        // Given
        val geometry = "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"

        val reportings = listOf(ReportingFixture.aReportingDTO())
        val regulatoryAreas = listOf(RegulatoryAreaFixture.aRegulatoryArea())
        val amps = listOf(AmpFixture.anAmp())
        val vigilanceAreas = listOf(VigilanceAreaFixture.aVigilanceArea())
        given(extractArea.execute(WKTReader().read(geometry))).willReturn(
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
            get("/bff/v1/dashboard/extract?geometry=$geometry")
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
    fun `extract should response ok when nothing intersect the given geometry`() {
        // Given
        val geometry = "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"

        val reportings: List<ReportingDTO> = listOf()
        val regulatoryAreas: List<RegulatoryAreaEntity> = listOf()
        val amps: List<AMPEntity> = listOf()
        val vigilanceAreas: List<VigilanceAreaEntity> = listOf()
        given(extractArea.execute(WKTReader().read(geometry))).willReturn(
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
            get("/bff/v1/dashboard/extract?geometry=$geometry")
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
}
