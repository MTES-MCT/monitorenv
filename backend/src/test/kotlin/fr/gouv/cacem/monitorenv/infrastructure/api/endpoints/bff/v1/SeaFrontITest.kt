package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.use_cases.facade.ComputeSeaFrontFromGeometry
import fr.gouv.cacem.monitorenv.domain.use_cases.facade.GetSeaFronts
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(SeaFront::class)])
class SeaFrontITest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getSeaFronts: GetSeaFronts

    @MockitoBean
    private lateinit var computeSeaFrontFromGeometry: ComputeSeaFrontFromGeometry

    @Test
    fun `Should get all facades`() {
        // Given
        val expectedFacades = listOf("NAMO")

        given(getSeaFronts.execute()).willReturn(expectedFacades)

        // When & Then
        mockMvc
            .perform(get("/bff/v1/sea-fronts"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.[0]", equalTo("NAMO")))
    }

    @Test
    fun `Should find facade from geom`() {
        // Given
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON(((-7.053858716342802 47.482021414897076,-6.661784131382319 46.05043975867042,-3.961207349155302 46.18608925819626,-4.895045239780757 47.52469665125105,-7.053858716342802 47.482021414897076)))"
        val polygon = wktReader.read(multipolygonString)

        given(computeSeaFrontFromGeometry.execute(polygon)).willReturn("NAMO")

        // When & Then
        mockMvc
            .perform(get("/bff/v1/sea-fronts/compute").param("geometry", multipolygonString))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.seaFront", equalTo("NAMO")))
    }
}
