package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.health.Health
import fr.gouv.cacem.monitorenv.domain.use_cases.healthcheck.GetHealthcheck
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.Healthcheck
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.mockito.Mockito.mock
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
@WebMvcTest(value = [(Healthcheck::class)])
class ApiHealthcheckITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private val getHealthcheck: GetHealthcheck = mock()

    @Test
    fun `Healthcheck returns number of reg areas`() {
        given(getHealthcheck.execute()).willReturn(
            Health(
                numberOfRegulatoryAreas = 13,
                numberOfMissions = 50,
                numberOfNatinfs = 50,
                numberOfSemaphores = 10,
                numberOfReportings = 50,
            ),
        )
        mockMvc
            .perform(get("/api/v1/healthcheck"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("numberOfRegulatoryAreas", equalTo(13)))
            .andExpect(jsonPath("numberOfMissions", equalTo(50)))
            .andExpect(jsonPath("numberOfNatinfs", equalTo(50)))
            .andExpect(jsonPath("numberOfSemaphores", equalTo(10)))
            .andExpect(jsonPath("numberOfReportings", equalTo(50)))
    }
}
