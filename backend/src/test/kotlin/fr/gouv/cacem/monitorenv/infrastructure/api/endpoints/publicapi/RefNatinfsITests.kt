package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.use_cases.refNatinfs.GetAllRefNatinfs
import fr.gouv.cacem.monitorenv.domain.use_cases.refNatinfs.fixtures.RefNatinfFixture.Companion.aRefNatinf
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.RefNatinfs
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
@WebMvcTest(value = [(RefNatinfs::class)])
class RefNatinfsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private val getAllRefNatinfs: GetAllRefNatinfs = mock()

    @Test
    fun `Should get all ref natinfs`() {
        // Given
        val refNatinf = aRefNatinf()
        val refNatinfs = listOf(refNatinf)
        given(getAllRefNatinfs.execute()).willReturn(refNatinfs)

        // When
        mockMvc
            .perform(get("/api/v1/ref_natinfs"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(refNatinf.id)))
            .andExpect(jsonPath("$[0].nature", equalTo(refNatinf.nature)))
            .andExpect(jsonPath("$[0].qualification", equalTo(refNatinf.qualification)))
            .andExpect(jsonPath("$[0].definedBy", equalTo(refNatinf.definedBy)))
            .andExpect(jsonPath("$[0].repressedBy", equalTo(refNatinf.repressedBy)))
    }
}
