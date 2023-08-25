package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlResources.GetLegacyControlUnits
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

@Import(WebSecurityConfig::class)
@WebMvcTest(value = [(LegacyControlUnitsController::class)])
class LegacyControlUnitsControllerITests {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var getLegacyControlUnits: GetLegacyControlUnits

    @Test
    fun `Should get all control units`() {
        // Given
        val controlUnit = LegacyControlUnitEntity(
            id = 4,
            administration = "Gendarmerie nationale",
            isArchived = false,
            name = "DF 123",
            resources = listOf(LegacyControlResourceEntity(1, "Vedette")),
        )
        given(getLegacyControlUnits.execute()).willReturn(listOf(controlUnit))

        // When
        mockMvc.perform(get("/bff/v1/legacy_control_units"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(controlUnit.id)))
            .andExpect(jsonPath("$[0].administration", equalTo(controlUnit.administration)))
            .andExpect(jsonPath("$[0].name", equalTo(controlUnit.name)))
            .andExpect(jsonPath("$[0].isArchived", equalTo(false)))
            .andExpect(jsonPath("$[0].resources[0].name", equalTo(controlUnit.resources.first().name)))
    }
}
