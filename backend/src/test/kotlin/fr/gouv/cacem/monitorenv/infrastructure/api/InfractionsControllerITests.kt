package fr.gouv.cacem.monitorenv.infrastructure.api

import fr.gouv.cacem.monitorenv.MeterRegistryConfiguration
import fr.gouv.cacem.monitorenv.domain.entities.infractions.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.crud.infractions.*
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.InfractionsController

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
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import com.fasterxml.jackson.databind.ObjectMapper

@Import(MeterRegistryConfiguration::class)
@ExtendWith(SpringExtension::class)
@WebMvcTest(value = [(InfractionsController::class)])
class InfractionsControllerITests {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @MockBean
  private lateinit var getInfractions: GetInfractions

  @Autowired
  private lateinit var objectMapper: ObjectMapper

  @Test
  fun `Should get all infractions`() {
    // Given
    val infraction = InfractionEntity(
      id=1005,
      natinf_code = "27718",
      regulation = "ART.L.945-4 AL.1, ART.L.945-5 1°, 2°, 3°, 4° C.RUR",
      infraction_category = "Pêche",
      infraction = "Debarquement de produits de la peche maritime et de l'aquaculture marine hors d'un port designe"
    )
    given(this.getInfractions.execute()).willReturn(listOf(infraction))

    // When
    mockMvc.perform(get("/bff/v1/infractions"))
      // Then
      .andExpect(status().isOk)
      .andExpect(jsonPath("$[0].id", equalTo(infraction.id)))
      .andExpect(jsonPath("$[0].natinf_code", equalTo(infraction.natinf_code)))
      .andExpect(jsonPath("$[0].regulation", equalTo(infraction.regulation)))
      .andExpect(jsonPath("$[0].infraction_category", equalTo(infraction.infraction_category)))
      .andExpect(jsonPath("$[0].infraction", equalTo(infraction.infraction)))
  }

}
