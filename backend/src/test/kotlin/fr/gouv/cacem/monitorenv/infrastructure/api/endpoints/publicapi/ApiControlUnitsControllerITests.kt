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
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v2.ApiControlUnitsController
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
    private lateinit var archiveControlUnit: ArchiveControlUnit

    @MockBean
    private lateinit var canDeleteControlUnit: CanDeleteControlUnit

    @MockBean
    private lateinit var createOrUpdateControlUnit: CreateOrUpdateControlUnit

    @MockBean
    private lateinit var deleteControlUnit: DeleteControlUnit

    @MockBean
    private lateinit var getControlUnitById: GetControlUnitById

    @MockBean
    private lateinit var getControlUnits: GetControlUnits

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `archive() should archive a control unit`() {
        val controlUnitId = 1

        mockMvc.perform(
            put("/api/v2/control_units/$controlUnitId/archive"),
        )
            .andExpect(status().isOk)

        BDDMockito.verify(archiveControlUnit).execute(controlUnitId)
    }

    @Test
    fun `canDelete() should check if a control unit can be deleted`() {
        val controlUnitId = 1
        val canDelete = true

        given(canDeleteControlUnit.execute(controlUnitId)).willReturn(canDelete)

        mockMvc.perform(
            get("/api/v2/control_units/$controlUnitId/can_delete"),
        )
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.value").value(canDelete))

        BDDMockito.verify(canDeleteControlUnit).execute(controlUnitId)
    }

    @Test
    fun `delete() should delete a control unit`() {
        val controlUnitId = 1

        mockMvc.perform(
            delete("/api/v2/control_units/$controlUnitId"),
        )
            .andExpect(status().isOk)

        BDDMockito.verify(deleteControlUnit).execute(controlUnitId)
    }

    @Test
    fun `create() should create a control unit`() {
        val expectedCreatedControlUnit = ControlUnitEntity(
            id = 1,
            administrationId = 0,
            areaNote = null,
            departmentAreaInseeCode = null,
            isArchived = false,
            name = "Unit Name",
            termsNote = null,
        )

        val newControlUnitData = CreateOrUpdateControlUnitDataInput(
            administrationId = 2,
            areaNote = null,
            departmentAreaInseeCode = null,
            isArchived = false,
            name = "Unit Name",
            termsNote = null,
        )
        val requestBody = objectMapper.writeValueAsString(newControlUnitData)

        given(createOrUpdateControlUnit.execute(controlUnit = any())).willReturn(
            expectedCreatedControlUnit,
        )

        mockMvc.perform(
            post("/api/v2/control_units")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isCreated)
    }

    @Test
    fun `get() should get a control unit by its ID`() {
        val expectedFullControlUnit = FullControlUnitDTO(
            administration = AdministrationEntity(
                id = 0,
                isArchived = false,
                name = "Administration Name",
            ),
            controlUnit = ControlUnitEntity(
                id = 1,
                administrationId = 0,
                areaNote = null,
                departmentAreaInseeCode = null,
                isArchived = false,
                name = "Unit Name",
                termsNote = null,
            ),
            controlUnitContacts = listOf(),
            controlUnitResources = listOf(),
        )

        val requestedId = 1

        given(getControlUnitById.execute(requestedId)).willReturn(expectedFullControlUnit)

        mockMvc.perform(get("/api/v2/control_units/$requestedId"))
            .andExpect(status().isOk)

        BDDMockito.verify(getControlUnitById).execute(requestedId)
    }

    @Test
    fun `getAll() should get all control units`() {
        val expectedControlUnits = listOf(
            FullControlUnitDTO(
                administration = AdministrationEntity(
                    id = 0,
                    isArchived = false,
                    name = "Administration Name",
                ),
                controlUnit = ControlUnitEntity(
                    id = 1,
                    administrationId = 0,
                    areaNote = null,
                    departmentAreaInseeCode = null,
                    isArchived = false,
                    name = "Unit Name",
                    termsNote = null,
                ),
                controlUnitContacts = listOf(),
                controlUnitResources = listOf(),
            ),

            FullControlUnitDTO(
                administration = AdministrationEntity(
                    id = 0,
                    isArchived = false,
                    name = "Administration Name",
                ),
                controlUnit = ControlUnitEntity(
                    id = 2,
                    administrationId = 0,
                    areaNote = null,
                    departmentAreaInseeCode = null,
                    isArchived = false,
                    name = "Unit Name 2",
                    termsNote = null,
                ),
                controlUnitContacts = listOf(),
                controlUnitResources = listOf(),
            ),
        )

        given(getControlUnits.execute()).willReturn(expectedControlUnits)

        mockMvc.perform(get("/api/v2/control_units"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))

        BDDMockito.verify(getControlUnits).execute()
    }

    @Test
    fun `update() should update a control unit`() {
        val expectedUpdatedControlUnit = ControlUnitEntity(
            id = 1,
            administrationId = 0,
            areaNote = null,
            departmentAreaInseeCode = null,
            isArchived = false,
            name = "Updated Unit Name",
            termsNote = null,
        )

        val nextControlUnitData = CreateOrUpdateControlUnitDataInput(
            id = 1,
            administrationId = 0,
            areaNote = null,
            departmentAreaInseeCode = null,
            isArchived = false,
            name = "Updated Unit Name",
            termsNote = null,
        )
        val requestBody = objectMapper.writeValueAsString(nextControlUnitData)

        given(createOrUpdateControlUnit.execute(controlUnit = any())).willReturn(expectedUpdatedControlUnit)

        mockMvc.perform(
            put("/api/v2/control_units/1")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }
}
