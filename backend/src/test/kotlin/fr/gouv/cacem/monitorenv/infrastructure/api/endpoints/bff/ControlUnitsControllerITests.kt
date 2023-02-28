package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.MeterRegistryConfiguration
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlResources.GetControlUnits
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(MeterRegistryConfiguration::class)
@ExtendWith(SpringExtension::class)
@WebMvcTest(value = [(ControlUnitsController::class)])
class ControlUnitsControllerITests {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getControlUnits: GetControlUnits

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should get all control units`() {
        // Given
        val controlUnit = ControlUnitEntity(
            id = 4,
            administration = "Gendarmerie nationale",
            isArchived = false,
            name = "DF 123",
            resources = listOf(ControlResourceEntity(1, "Vedette"))
        )
        given(this.getControlUnits.execute()).willReturn(listOf(controlUnit))

        // When
        mockMvc.perform(get("/bff/v1/control_units"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(controlUnit.id)))
            .andExpect(jsonPath("$[0].administration", equalTo(controlUnit.administration)))
            .andExpect(jsonPath("$[0].name", equalTo(controlUnit.name)))
            .andExpect(jsonPath("$[0].isArchived", equalTo(false)))
            .andExpect(jsonPath("$[0].resources[0].name", equalTo(controlUnit.resources.first().name)))
    }
}
