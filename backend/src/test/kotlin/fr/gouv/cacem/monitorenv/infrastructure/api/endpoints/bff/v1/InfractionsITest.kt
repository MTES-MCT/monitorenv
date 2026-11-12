package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.GetEnvActionsByMmsi
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvActionControlWithInfractions
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.GetSuspicionOfInfractionsByMmsi
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.AbstractEndpointTests
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
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

@WithMockUser(roles = ["SUPER_USER"])
@WebMvcTest(value = [(Infractions::class)])
class InfractionsITest : AbstractEndpointTests() {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getSuspicionOfInfractionsByMmsi: GetSuspicionOfInfractionsByMmsi

    @MockitoBean
    private lateinit var getEnvActionsByMmsi: GetEnvActionsByMmsi

    @Test
    @WithAnonymousUser
    fun `getAll() should return 403 when the user is authenticated without roles`() {
        val mmsi = "0123456789"

        mockMvc
            .perform(
                get("/bff/v1/infractions/actions/$mmsi")
                    .contentType(MediaType.APPLICATION_JSON),
            )
            .andExpect(status().isForbidden)
    }

    @Test
    fun `getAll should return all envActions with given mmsi`() {
        // Given
        val mmsi = "0123456789"
        given(getEnvActionsByMmsi.execute(mmsi, null)).willReturn(
            listOf(anEnvActionControlWithInfractions()),
        )

        // When
        mockMvc
            .perform(
                get("/bff/v1/infractions/actions/$mmsi")
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.size()", equalTo(1)))
    }

    @Test
    fun `getSuspicionOfInfractions should return suspicionOfInfractions with given mmsi`() {
        // Given
        val mmsi = "0123456789"

        given(getSuspicionOfInfractionsByMmsi.execute(mmsi, null))
            .willReturn(
                listOf(ReportingFixture.aSupicionOfInfraction(id = 1), ReportingFixture.aSupicionOfInfraction(id = 2)),
            )

        // When
        mockMvc
            .perform(
                get("/bff/v1/infractions/reportings/$mmsi")
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.size()", equalTo(2)))
    }
}
