package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.health.Health
import fr.gouv.cacem.monitorenv.domain.use_cases.healthcheck.GetHealthcheck
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(WebSecurityConfig::class, SentryConfig::class)
@WebMvcTest(value = [(HealthcheckController::class)])
class HealthcheckControllerITests {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getHealthcheck: GetHealthcheck

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
        mockMvc.perform(get("/bff/v1/healthcheck"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("numberOfRegulatoryAreas", equalTo(13)))
            .andExpect(jsonPath("numberOfMissions", equalTo(50)))
            .andExpect(jsonPath("numberOfNatinfs", equalTo(50)))
            .andExpect(jsonPath("numberOfSemaphores", equalTo(10)))
            .andExpect(jsonPath("numberOfReportings", equalTo(50)))
    }
}
