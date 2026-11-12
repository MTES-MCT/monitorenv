package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetNearbyUnits
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.NearbyUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture.Companion.aControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.AbstractEndpointTests
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.io.WKTReader
import org.mockito.Mockito.mock
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.http.MediaType
import org.springframework.security.test.context.support.WithAnonymousUser
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime

@WithMockUser(roles = ["SUPER_USER"])
@WebMvcTest(value = [(ControlUnits::class)])
class ControlUnitsITests : AbstractEndpointTests() {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private val getNearbyUnits: GetNearbyUnits = mock()

    @Test
    @WithAnonymousUser
    fun `getAll() should return 403 when the user is authenticated without roles`() {
        val geometry = "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"

        val from = "2025-01-01T00:00:00Z"
        val to = "2025-01-08T00:00:00Z"

        mockMvc
            .perform(
                get("/bff/v1/control_units/nearby?geometry=$geometry&from=$from&to=$to")
                    .contentType(MediaType.APPLICATION_JSON),
            ).andExpect(status().isForbidden)
    }

    @Test
    @WithMockUser
    fun `getAll() should return 403 when the user is authenticated with role USER`() {
        val geometry = "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"

        val from = "2025-01-01T00:00:00Z"
        val to = "2025-01-08T00:00:00Z"

        mockMvc
            .perform(
                get("/bff/v1/control_units/nearby?geometry=$geometry&from=$from&to=$to")
                    .contentType(MediaType.APPLICATION_JSON),
            ).andExpect(status().isForbidden)
    }

    @Test
    fun `getNearbyUnits() should return a control unit with mission whose action are within geometry and date range`() {
        val geometry = "MULTIPOINT ((-1.548 44.315),(-1.245 44.305))"

        val controlUnit = aControlUnit()

        val from = "2025-01-01T00:00:00Z"
        val to = "2025-01-08T00:00:00Z"
        val fromDate = ZonedDateTime.parse(from)
        val toDate = ZonedDateTime.parse(to)

        val mission = aMissionEntity()
        given(getNearbyUnits.execute(WKTReader().read(geometry), fromDate, toDate)).willReturn(
            listOf(
                NearbyUnit(
                    controlUnit = controlUnit,
                    missions = listOf(mission),
                ),
            ),
        )

        mockMvc
            .perform(
                get("/bff/v1/control_units/nearby?geometry=$geometry&from=$from&to=$to")
                    .contentType(MediaType.APPLICATION_JSON),
            ).andExpect(status().isOk)
            .andExpect(jsonPath("$[0].controlUnit.name", equalTo(controlUnit.name)))
            .andExpect(jsonPath("$[0].missions[0].id", equalTo(mission.id)))

        verify(getNearbyUnits).execute(WKTReader().read(geometry), fromDate, toDate)
    }
}
