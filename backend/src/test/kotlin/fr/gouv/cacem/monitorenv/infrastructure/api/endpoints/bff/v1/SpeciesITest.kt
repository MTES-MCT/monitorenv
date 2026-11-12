package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import fr.gouv.cacem.monitorenv.domain.use_cases.species.GetSpecies
import fr.gouv.cacem.monitorenv.domain.use_cases.species.fixtures.SpecyFixture.Companion.aSpecy
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.AbstractEndpointTests
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.security.test.context.support.WithAnonymousUser
import org.springframework.security.test.context.support.WithMockUser
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@WithMockUser
@WebMvcTest(value = [(Species::class)])
class SpeciesITest : AbstractEndpointTests() {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var getSpecies: GetSpecies

    @Test
    @WithAnonymousUser
    fun `getAll() should return 403 when the user is authenticated without roles`() {
        mockMvc
            .perform(get("/bff/v1/species"))
            .andExpect(status().isForbidden)
    }

    @Test
    fun `Should get all species`() {
        // Given
        val species = listOf(aSpecy())
        given(getSpecies.execute()).willReturn(species)
        // When
        mockMvc
            .perform(get("/bff/v1/species"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(1)))
            .andExpect(jsonPath("$[0].code", equalTo("A")))
            .andExpect(jsonPath("$[0].name", equalTo("Test Specy 1")))
    }
}
