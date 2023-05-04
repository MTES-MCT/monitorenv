package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.MeterRegistryConfiguration
import fr.gouv.cacem.monitorenv.domain.entities.natinfs.NatinfEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.natinfs.GetNatinfs
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(MeterRegistryConfiguration::class)
@ExtendWith(SpringExtension::class)
@WebMvcTest(value = [(NatinfsController::class)])
class NatinfsControllerITests {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getNatinfs: GetNatinfs

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should get all infractions`() {
        // Given
        val natinf = NatinfEntity(
            natinfCode = 27718,
            regulation = "ART.L.945-4 AL.1, ART.L.945-5 1°, 2°, 3°, 4° C.RUR",
            infractionCategory = "Pêche",
            infraction = "Debarquement de produits de la peche maritime et de l'aquaculture marine hors d'un port designe"
        )
        given(this.getNatinfs.execute()).willReturn(listOf(natinf))

        // When
        mockMvc.perform(get("/bff/v1/natinfs"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].natinfCode", equalTo(natinf.natinfCode)))
            .andExpect(jsonPath("$[0].regulation", equalTo(natinf.regulation)))
            .andExpect(jsonPath("$[0].infractionCategory", equalTo(natinf.infractionCategory)))
            .andExpect(jsonPath("$[0].infraction", equalTo(natinf.infraction)))
    }
}
