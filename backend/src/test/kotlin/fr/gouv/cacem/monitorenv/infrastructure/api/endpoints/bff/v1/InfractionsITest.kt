package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.GetEnvActionsByMmsi
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvActionControlWithInfractions
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.GetSuspicionOfInfractionsByMmsi
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.fixtures.ReportingFixture
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
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
@WebMvcTest(value = [(Infractions::class)])
class InfractionsITest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getSuspicionOfInfractionsByMmsi: GetSuspicionOfInfractionsByMmsi

    @MockitoBean
    private lateinit var getEnvActionsByMmsi: GetEnvActionsByMmsi

    @Test
    fun `getAll should return all envActions with given mmsi`() {
        // Given
        val mmsi = "0123456789"
        given(getEnvActionsByMmsi.execute(mmsi)).willReturn(
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
