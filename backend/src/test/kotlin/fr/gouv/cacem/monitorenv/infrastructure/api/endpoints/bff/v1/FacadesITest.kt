package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.seafront.FacadeEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.facade.GetFacades
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
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
@WebMvcTest(value = [(Facades::class)])
class FacadesITest {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getFacades: GetFacades

    @Test
    fun `Should get all facades`() {
        // Given
        val expectedFacades = listOf(FacadeEntity(id = 1, facade = "NAMO"))

        given(getFacades.execute()).willReturn(expectedFacades)

        // When & Then
        mockMvc
            .perform(get("/bff/v1/facades"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.[0].id", equalTo(1)))
            .andExpect(MockMvcResultMatchers.jsonPath("$.[0].facade", equalTo("NAMO")))
    }
}
