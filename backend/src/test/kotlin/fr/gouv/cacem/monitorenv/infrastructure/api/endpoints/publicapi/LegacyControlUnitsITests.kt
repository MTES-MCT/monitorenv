package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetLegacyControlUnits
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.LegacyControlUnits
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
@WebMvcTest(value = [(LegacyControlUnits::class)])
class LegacyControlUnitsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private val getLegacyControlUnits: GetLegacyControlUnits = mock()

    @Test
    fun `Should get all control units`() {
        // Given
        val controlUnit =
            LegacyControlUnitEntity(
                id = 4,
                administration = "Gendarmerie nationale",
                isArchived = false,
                name = "DF 123",
                resources =
                listOf(
                    LegacyControlUnitResourceEntity(
                        id = 0,
                        controlUnitId = 4,
                        name = "Vedette",
                    ),
                ),
            )
        given(getLegacyControlUnits.execute()).willReturn(listOf(controlUnit))

        // When
        mockMvc.perform(get("/api/v1/control_units"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].id", equalTo(controlUnit.id)))
            .andExpect(jsonPath("$[0].administration", equalTo(controlUnit.administration)))
            .andExpect(jsonPath("$[0].name", equalTo(controlUnit.name)))
            .andExpect(jsonPath("$[0].isArchived", equalTo(false)))
            .andExpect(jsonPath("$[0].resources[0].id", equalTo(controlUnit.resources.first().id)))
            .andExpect(jsonPath("$[0].resources[0].name", equalTo(controlUnit.resources.first().name)))
    }
}
