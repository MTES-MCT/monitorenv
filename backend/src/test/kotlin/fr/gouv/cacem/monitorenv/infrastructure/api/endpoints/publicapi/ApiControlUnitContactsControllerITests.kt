package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContactById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContacts
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitContactDataInput
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
@WebMvcTest(value = [(ApiControlUnitContactsController::class)])
class ApiControlUnitContactsControllerITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var createOrUpdateControlUnitContact: CreateOrUpdateControlUnitContact

    @MockBean
    private lateinit var getControlUnitContactById: GetControlUnitContactById

    @MockBean
    private lateinit var getControlUnitContacts: GetControlUnitContacts

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should create a contact`() {
        val expectedCreatedControlUnitContact = ControlUnitContactEntity(
            id = 1,
            controlUnitId = 0,
            email = null,
            name = "Contact Name",
            phone = null,
        )

        val newControlUnitContactData = CreateOrUpdateControlUnitContactDataInput(
            controlUnitId = 0,
            email = null,
            name = "Contact Name",
            phone = null,
        )
        val requestBody = objectMapper.writeValueAsString(newControlUnitContactData)

        given(createOrUpdateControlUnitContact.execute(controlUnitContact = any())).willReturn(
            expectedCreatedControlUnitContact
        )

        mockMvc.perform(
            post("/api/v1/control_unit_contacts")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isCreated)
    }

    @Test
    fun `Should get a contact by its ID`() {
        val expectedFullControlUnitContact = FullControlUnitContactDTO(
            controlUnit = ControlUnitEntity(
                id = 0,
                administrationId = 0,
                areaNote = null,
                departmentAreaInseeCode = null,
                isArchived = false,
                name = "Unit Name",
                termsNote = null,
            ),
            controlUnitContact = ControlUnitContactEntity(
                id = 1,
                controlUnitId = 0,
                email = null,
                name = "Contact Name",
                phone = null,
            )
        )

        val requestedId = 1

        given(getControlUnitContactById.execute(requestedId)).willReturn(expectedFullControlUnitContact)

        mockMvc.perform(get("/api/v1/control_unit_contacts/$requestedId"))
            .andExpect(status().isOk)

        BDDMockito.verify(getControlUnitContactById).execute(requestedId)
    }

    @Test
    fun `Should get all contacts`() {
        val expectedFullControlUnitContacts = listOf(
            FullControlUnitContactDTO(
                controlUnit = ControlUnitEntity(
                    id = 0,
                    administrationId = 0,
                    areaNote = null,
                    departmentAreaInseeCode = null,
                    isArchived = false,
                    name = "Unit Name",
                    termsNote = null,
                ),
                controlUnitContact = ControlUnitContactEntity(
                    id = 1,
                    controlUnitId = 0,
                    email = null,
                    name = "Contact Name",
                    phone = null,
                ),
            ),

            FullControlUnitContactDTO(
                controlUnit = ControlUnitEntity(
                    id = 0,
                    administrationId = 0,
                    areaNote = null,
                    departmentAreaInseeCode = null,
                    isArchived = false,
                    name = "Unit Name",
                    termsNote = null,
                ),
                controlUnitContact = ControlUnitContactEntity(
                    id = 2,
                    controlUnitId = 0,
                    email = null,
                    name = "Contact Name 2",
                    phone = null,
                ),
            )
        )

        given(getControlUnitContacts.execute()).willReturn(expectedFullControlUnitContacts)

        mockMvc.perform(get("/api/v1/control_unit_contacts"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))

        BDDMockito.verify(getControlUnitContacts).execute()
    }

    @Test
    fun `Should update a contact`() {
        val expectedUpdatedControlUnitContact = ControlUnitContactEntity(
            id = 1,
            controlUnitId = 0,
            email = null,
            name = "Updated Contact Name",
            phone = null,
        )

        val nextControlUnitContactData = CreateOrUpdateControlUnitContactDataInput(
            id = 1,
            email = null,
            controlUnitId = 0,
            name = "Updated Contact Name",
            phone = null,
        )
        val requestBody = objectMapper.writeValueAsString(nextControlUnitContactData)

        given(createOrUpdateControlUnitContact.execute(controlUnitContact = any())).willReturn(
            expectedUpdatedControlUnitContact
        )

        mockMvc.perform(
            put("/api/v1/control_unit_contacts/1")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }
}
