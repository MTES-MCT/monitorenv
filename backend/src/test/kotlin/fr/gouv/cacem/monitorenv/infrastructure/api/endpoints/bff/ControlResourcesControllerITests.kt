package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.MeterRegistryConfiguration
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlResourceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlResources.*
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.ControlResourcesController

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
import fr.gouv.cacem.monitorenv.domain.use_cases.controlResources.GetControlResources

@Import(MeterRegistryConfiguration::class)
@ExtendWith(SpringExtension::class)
@WebMvcTest(value = [(ControlResourcesController::class)])
class ControlResourcesControllerITests {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getControlResources: GetControlResources

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should get all control resources`() {
        // Given

        val controlResource = ControlResourceEntity(
          id=4,
          facade = "MED",
          administration = "Gendarmerie nationale",
          size = "10,00 m",
          name = "vedette"	,
          city = "Agde"
        )
        given(this.getControlResources.execute()).willReturn(listOf(controlResource))

        // When
        mockMvc.perform(get("/bff/v1/controlresources"))
                // Then
                .andExpect(status().isOk)
                .andExpect(jsonPath("$[0].id", equalTo(controlResource.id)))
                .andExpect(jsonPath("$[0].facade", equalTo(controlResource.facade)))
                .andExpect(jsonPath("$[0].administration", equalTo(controlResource.administration)))
                .andExpect(jsonPath("$[0].name", equalTo(controlResource.name)))
    }

}
