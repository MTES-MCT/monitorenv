package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.CreateOrUpdateVigilanceArea
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.GetVigilanceArea
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.GetVigilanceAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea.VigilanceAreaDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1.VigilanceAreas
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [(VigilanceAreas::class)])
class VigilanceAreasITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getAllVigilanceAreas: GetVigilanceAreas

    @MockBean
    private lateinit var getVigilanceAreaById: GetVigilanceArea

    @MockBean
    private lateinit var createOrUpdateVigilanceArea: CreateOrUpdateVigilanceArea

    @Autowired private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should get all vigilance areas`() {
        // Given
        val wktReader = WKTReader()
        val pointString = "POINT (-4.54877816747593 48.305559876971)"
        val point = wktReader.read(pointString) as Point
        val vigilanceArea = VigilanceAreaEntity(
            id = 1,
            name = "Vigilance Area 1",
            isDraft = true,
        )
        given(getAllVigilanceAreas.execute()).willReturn(listOf(vigilanceArea))
        // When
        mockMvc.perform(get("/bff/v1/vigilance_areas"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(vigilanceArea.id)))
            .andExpect(jsonPath("$[0].name", equalTo(vigilanceArea.name)))
            .andExpect(jsonPath("$[0].geom.type", equalTo("Point")))
            .andExpect(jsonPath("$[0].geom.coordinates.[0]", equalTo(-4.54877817)))
            .andExpect(jsonPath("$[0].geom.coordinates.[1]", equalTo(48.30555988)))
    }

    @Test
    fun `Should get specific vigilance area`() {
        // Given
        val wktReader = WKTReader()
        val pointString = "POINT (-4.54877816747593 48.305559876971)"
        val point = wktReader.read(pointString) as Point
        val vigilanceArea = VigilanceAreaEntity(
            id = 21,
            name = "Vigilance Area 1",
            isDraft = true,
        )
        given(getVigilanceAreaById.execute(21)).willReturn(vigilanceArea)
        // When
        mockMvc.perform(get("/bff/v1/vigilance_areas/21"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(vigilanceArea.id)))
            .andExpect(jsonPath("$.name", equalTo(vigilanceArea.name)))
            .andExpect(jsonPath("$.geom.type", equalTo("Point")))
            .andExpect(jsonPath("$.geom.coordinates.[0]", equalTo(-4.54877817)))
            .andExpect(jsonPath("$.geom.coordinates.[1]", equalTo(48.30555988)))
    }

    @Test
    fun `Should create a new vigilance area`() {
        // Given
        val wktReader = WKTReader()
        val pointString = "POINT (-4.54877816747593 48.305559876971)"
        val point = wktReader.read(pointString) as Point
        val vigilanceArea = VigilanceAreaEntity(
            id = 1,
            name = "Vigilance Area 1",
            isDraft = true,
        )
        val vigilanceAreaDataInput = VigilanceAreaDataInput(
            id = 1,
            name = "Vigilance Area 1",
            isDraft = true,
        )
        given(createOrUpdateVigilanceArea.execute(vigilanceArea)).willReturn(vigilanceArea)
        // When
        mockMvc.perform(
            put("/bff/v1/vigilance_areas")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(vigilanceAreaDataInput)),
        )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(vigilanceArea.id)))
            .andExpect(jsonPath("$.name", equalTo(vigilanceArea.name)))
            .andExpect(jsonPath("$.geom.type", equalTo("Point")))
            .andExpect(jsonPath("$.geom.coordinates.[0]", equalTo(-4.54877817)))
            .andExpect(jsonPath("$.geom.coordinates.[1]", equalTo(48.30555988)))
    }
}
