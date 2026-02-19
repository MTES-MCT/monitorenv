package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.localizedArea.LocalizedAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.localizedArea.GetAllLocalizedAreas
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(LocalizedAreas::class)])
class LocalizedAreasITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getAllLocalizedAreas: GetAllLocalizedAreas

    private val wktReader = WKTReader()

    private val multipolygonString =
        "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
    private val polygon = wktReader.read(multipolygonString) as MultiPolygon

    @Test
    fun `Should get all localized Areas`() {
        // Given
        val localizedArea =
            LocalizedAreaEntity(
                id = 17,
                geom = polygon,
                groupName = "Secteur 1",
                name = "Roscanvel",
                controlUnitIds = listOf(1, 2),
                ampIds = listOf(3, 4),
            )
        given(getAllLocalizedAreas.execute()).willReturn(listOf(localizedArea))

        // When
        mockMvc
            .perform(get("/bff/v1/localized_areas"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(localizedArea.id)))
            .andExpect(jsonPath("$[0].name", equalTo(localizedArea.name)))
            .andExpect(jsonPath("$[0].groupName", equalTo(localizedArea.groupName)))
            .andExpect(jsonPath("$[0].geom.type", equalTo("MultiPolygon")))
            .andExpect(jsonPath("$[0].controlUnitIds", equalTo(localizedArea.controlUnitIds)))
            .andExpect(jsonPath("$[0].ampIds", equalTo(localizedArea.ampIds)))
    }
}
