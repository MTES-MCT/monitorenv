package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAllAMPs
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAllAMPsByIds
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.amps.AmpByIdsDataInput
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(Amps::class)])
class AmpsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getAllAMPs: GetAllAMPs

    @MockitoBean
    private lateinit var getAllAMPByIds: GetAllAMPsByIds

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    val multipolygonString =
        "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
    val wktReader = WKTReader()
    val polygon = wktReader.read(multipolygonString) as MultiPolygon
    val amp =
        AMPEntity(
            id = 1,
            designation = "ma designation",
            geom = polygon,
            name = "mon nom",
            refReg = "ma ref reg",
            type = "mon type",
            urlLegicem = "mon url legicem",
        )

    @Test
    fun `should return AMPs as json`() {
        // Given
        given(getAllAMPs.execute()).willReturn(listOf(amp))

        // When
        mockMvc
            .perform(get("/bff/v1/amps"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(amp.id)))
            .andExpect(jsonPath("$[0].designation", equalTo(amp.designation)))
            .andExpect(jsonPath("$[0].geom").exists())
            .andExpect(jsonPath("$[0].name", equalTo(amp.name)))
            .andExpect(jsonPath("$[0].refReg", equalTo(amp.refReg)))
            .andExpect(jsonPath("$[0].type", equalTo(amp.type)))
            .andExpect(jsonPath("$[0].urlLegicem", equalTo(amp.urlLegicem)))
    }

    @Test
    fun `Should retrieve amps that match ids`() {
        // Given
        val multipolygonString =
            "MULTIPOLYGON(((-7.053858716342802 47.482021414897076,-6.661784131382319 46.05043975867042,-3.961207349155302 46.18608925819626,-4.895045239780757 47.52469665125105,-7.053858716342802 47.482021414897076)))"
        val wktReader = WKTReader()
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        val otherAmp =
            AMPEntity(
                id = 2,
                designation = "mon AMP",
                geom = polygon,
                name = "mon nom2",
                refReg = "ma ref reg2",
                type = "mon type2",
                urlLegicem = "mon url legicem2",
            )
        given(getAllAMPByIds.execute(listOf(1, 2), "NORTH_SOUTH")).willReturn(listOf(amp, otherAmp))

        val body = AmpByIdsDataInput(ids = listOf(1, 2), axis = "NORTH_SOUTH")
        // When
        mockMvc
            .perform(
                MockMvcRequestBuilders
                    .post("/bff/v1/amps")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(body)),
            ).andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(amp.id)))
            .andExpect(jsonPath("$[0].designation", equalTo(amp.designation)))
            .andExpect(jsonPath("$[0].geom").exists())
            .andExpect(jsonPath("$[0].name", equalTo(amp.name)))
            .andExpect(jsonPath("$[0].refReg", equalTo(amp.refReg)))
            .andExpect(jsonPath("$[0].type", equalTo(amp.type)))
            .andExpect(jsonPath("$[0].urlLegicem", equalTo(amp.urlLegicem)))
            .andExpect(jsonPath("$[1].id", equalTo(otherAmp.id)))
            .andExpect(jsonPath("$[1].designation", equalTo(otherAmp.designation)))
            .andExpect(jsonPath("$[1].geom").exists())
            .andExpect(jsonPath("$[1].name", equalTo(otherAmp.name)))
            .andExpect(jsonPath("$[1].refReg", equalTo(otherAmp.refReg)))
            .andExpect(jsonPath("$[1].type", equalTo(otherAmp.type)))
            .andExpect(jsonPath("$[1].urlLegicem", equalTo(otherAmp.urlLegicem)))
    }
}
