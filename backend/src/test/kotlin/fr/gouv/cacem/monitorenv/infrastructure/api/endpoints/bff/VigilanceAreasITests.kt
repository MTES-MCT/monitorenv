package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.CreateOrUpdateVigilanceArea
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.DeleteVigilanceArea
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.GetVigilanceAreaById
import fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.GetVigilanceAreas
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea.VigilanceAreaDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1.VigilanceAreas
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
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
    private lateinit var getVigilanceAreaById: GetVigilanceAreaById

    @MockBean
    private lateinit var createOrUpdateVigilanceArea: CreateOrUpdateVigilanceArea

    @MockBean
    private lateinit var deleteVigilanceArea: DeleteVigilanceArea

    @Autowired private lateinit var objectMapper: ObjectMapper

    private val polygon =
        WKTReader()
            .read(
                "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))",
            ) as
            MultiPolygon
    private val point = WKTReader().read("POINT (-4.54877816747593 48.305559876971)") as Point

    @Test
    fun `Should get all vigilance areas`() {
        // Given
        val vigilanceArea = VigilanceAreaEntity(
            id = 1,
            name = "Vigilance Area 1",
            geom = polygon,
            isDeleted = false,
            isDraft = true,
        )
        given(getAllVigilanceAreas.execute()).willReturn(listOf(vigilanceArea))
        // When
        mockMvc.perform(get("/bff/v1/vigilance_areas"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(1)))
            .andExpect(jsonPath("$[0].name", equalTo("Vigilance Area 1")))
            .andExpect(jsonPath("$[0].geom.type", equalTo("MultiPolygon")))
    }

    @Test
    fun `Should get specific vigilance area`() {
        // Given
        val vigilanceArea = VigilanceAreaEntity(
            id = 21,
            name = "Vigilance Area 1",
            geom = polygon,
            isDeleted = false,
            isDraft = true,
        )
        given(getVigilanceAreaById.execute(21)).willReturn(vigilanceArea)
        // When
        mockMvc.perform(get("/bff/v1/vigilance_areas/21"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(21)))
            .andExpect(jsonPath("$.name", equalTo("Vigilance Area 1")))
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon")))
    }

    @Test
    fun `Should create a new vigilance area`() {
        // Given
        val vigilanceArea = VigilanceAreaEntity(
            id = 1,
            name = "Vigilance Area 1",
            geom = polygon,
            isDeleted = false,
            isDraft = true,
        )
        val vigilanceAreaDataInput = VigilanceAreaDataInput(
            id = 1,
            name = "Vigilance Area 1",
            isDraft = true,
            geom = polygon,
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
            .andExpect(jsonPath("$.id", equalTo(1)))
            .andExpect(jsonPath("$.name", equalTo("Vigilance Area 1")))
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon")))
    }

    @Test
    fun `Should update a vigilance area`() {
        // Given
        val updatedVigilanceArea = VigilanceAreaEntity(
            id = 1,
            name = "Updated Vigilance Area 1",
            geom = polygon,
            isDeleted = false,
            isDraft = true,
        )
        val vigilanceAreaDataInput = VigilanceAreaDataInput(
            id = 1,
            name = "Updated Vigilance Area 1",
            isDraft = true,
            geom = polygon,
        )
        given(createOrUpdateVigilanceArea.execute(updatedVigilanceArea)).willReturn(updatedVigilanceArea)
        // When
        mockMvc.perform(
            put("/bff/v1/vigilance_areas/1")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(vigilanceAreaDataInput)),
        )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(1)))
            .andExpect(jsonPath("$.name", equalTo("Updated Vigilance Area 1")))
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon")))
    }

    @Test
    fun `Should delete vigilance area`() {
        // Given
        val vigilanceAreaId = 20
        // When
        mockMvc.perform(delete("/bff/v1/vigilance_areas/$vigilanceAreaId"))
            // Then
            .andExpect(status().isNoContent())
    }
}
