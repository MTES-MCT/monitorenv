package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.NearbyUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture.Companion.aLegacyControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetNearbyUnits
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.io.WKTReader
import org.mockito.Mockito.mock
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(ControlUnits::class)])
class ControlUnitsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private val getNearbyUnits: GetNearbyUnits = mock()

    @Test
    fun `getNearbyUnits() should return a control unit with mission whose action are within geometry`() {
        val geometry = "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"

        val controlUnit = aLegacyControlUnit()

        val mission = aMissionEntity()
        given(getNearbyUnits.execute(WKTReader().read(geometry))).willReturn(
            listOf(
                NearbyUnit(
                    controlUnit = controlUnit,
                    missions = listOf(mission)
                )
            )
        )

        mockMvc
            .perform(
                get("/bff/v1/control_units/nearby?geometry=$geometry")
                    .contentType(MediaType.APPLICATION_JSON)
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$[0].controlUnit.name", equalTo(controlUnit.name)))
            .andExpect(jsonPath("$[0].missions[0].id", equalTo(mission.id)))

        verify(getNearbyUnits).execute(WKTReader().read(geometry))
    }
}
