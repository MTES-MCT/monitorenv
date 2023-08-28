package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.*
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitDataInput
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito
import org.mockito.BDDMockito.given
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [(ApiControlUnitsController::class)])
class ApiControlUnitsControllerITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var createOrUpdateControlUnit: CreateOrUpdateControlUnit

    @MockBean
    private lateinit var getControlUnitById: GetControlUnitById

    @MockBean
    private lateinit var getControlUnits: GetControlUnits

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should create a control unit`() {
        val expectedNewControlUnit = ControlUnitEntity(
            id = 1,
            administrationId = 2,
            controlUnitContactIds = listOf(),
            controlUnitResourceIds = listOf(),
            areaNote = null,
            isArchived = false,
            name = "Control Unit Name",
            termsNote = null,
        )

        val request = CreateOrUpdateControlUnitDataInput(
            administrationId = 2,
            controlUnitContactIds = listOf(),
            controlUnitResourceIds = listOf(),
            areaNote = null,
            isArchived = false,
            name = "Control Unit Name",
            termsNote = null,
        )
        val requestBody = objectMapper.writeValueAsString(request)

        given(createOrUpdateControlUnit.execute(controlUnit = any())).willReturn(
            expectedNewControlUnit
        )

        mockMvc.perform(
            post("/api/v1/control_units")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }

    @Test
    fun `Should get a control unit by its ID`() {
        val expectedFullControlUnit = FullControlUnitDTO(
            id = 1,
            administration = AdministrationEntity(
                id = 2,
                controlUnitIds = listOf(),
                name = "Administration Name",
            ),
            administrationId = 2,
            areaNote = null,
            controlUnitContactIds = listOf(),
            controlUnitContacts = listOf(),
            controlUnitResourceIds = listOf(),
            controlUnitResources = listOf(),
            isArchived = false,
            name = "Contact Name",
            termsNote = null,
        )

        val requestedId = 1

        given(getControlUnitById.execute(requestedId)).willReturn(expectedFullControlUnit)

        mockMvc.perform(get("/api/v1/control_units/$requestedId"))
            .andExpect(status().isOk)

        BDDMockito.verify(getControlUnitById).execute(requestedId)
    }

    @Test
    fun `Should get all control units`() {
        val expectedControlUnits = listOf(
            FullControlUnitDTO(
                id = 1,
                administration = AdministrationEntity(
                    id = 2,
                    controlUnitIds = listOf(),
                    name = "Administration Name",
                ),
                administrationId = 2,
                areaNote = null,
                controlUnitContactIds = listOf(),
                controlUnitContacts = listOf(),
                controlUnitResourceIds = listOf(),
                controlUnitResources = listOf(),
                isArchived = false,
                name = "Contact Name",
                termsNote = null,
            ),

            FullControlUnitDTO(
                id = 3,
                administration = AdministrationEntity(
                    id = 4,
                    controlUnitIds = listOf(),
                    name = "Administration Name 2",
                ),
                administrationId = 4,
                areaNote = null,
                controlUnitContactIds = listOf(),
                controlUnitContacts = listOf(),
                controlUnitResourceIds = listOf(),
                controlUnitResources = listOf(),
                isArchived = false,
                name = "Contact Name 2",
                termsNote = null,
            )
        )

        given(getControlUnits.execute()).willReturn(expectedControlUnits)

        mockMvc.perform(get("/api/v1/control_units"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))

        BDDMockito.verify(getControlUnits).execute()
    }

    @Test
    fun `Should update a control unit`() {
        val updatedControlUnit = ControlUnitEntity(
            id = 1,
            administrationId = 2,
            controlUnitContactIds = listOf(),
            controlUnitResourceIds = listOf(),
            areaNote = null,
            isArchived = false,
            name = "Updated Control Unit Name",
            termsNote = null,
        )

        val request = CreateOrUpdateControlUnitDataInput(
            id = 1,
            administrationId = 2,
            controlUnitContactIds = listOf(),
            controlUnitResourceIds = listOf(),
            areaNote = null,
            isArchived = false,
            name = "Updated Control Unit Name",
            termsNote = null,
        )
        val requestBody = objectMapper.writeValueAsString(request)

        given(createOrUpdateControlUnit.execute(controlUnit = any())).willReturn(updatedControlUnit)

        mockMvc.perform(
            put("/api/v1/control_units/1")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }
}
