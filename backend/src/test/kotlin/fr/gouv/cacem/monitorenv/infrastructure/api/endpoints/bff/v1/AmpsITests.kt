package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAMPById
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAMPsByIds
import fr.gouv.cacem.monitorenv.domain.use_cases.amps.GetAllAMPs
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
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
    private lateinit var getAMPsByIds: GetAMPsByIds

    @MockitoBean
    private lateinit var getAMPById: GetAMPById

    @Test
    fun `should return AMPs as json`() {
        // Given
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
        given(getAllAMPs.execute(false)).willReturn(listOf(amp))

        // When
        mockMvc
            .perform(get("/bff/v1/amps?withGeometry=false"))
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
}
