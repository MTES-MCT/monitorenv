package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.*
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
    fun `Should create a new contact`() {
        val expectedNewControlUnitContact = ControlUnitContactEntity(
            id = 1,
            controlUnitId = 2,
            email = null,
            name = "Contact Name",
            note = null,
            phone = null,
        )

        val request = CreateOrUpdateControlUnitContactDataInput(
            controlUnitId = 2,
            email = null,
            name = "Contact Name",
            note = null,
            phone = null,
        )
        val requestBody = objectMapper.writeValueAsString(request)

        given(createOrUpdateControlUnitContact.execute(controlUnitContact = any())).willReturn(
            expectedNewControlUnitContact
        )

        mockMvc.perform(
            post("/api/v1/control_unit_contacts")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }

    @Test
    fun `Should get a contact by its ID`() {
        val expectedFullControlUnitContact = FullControlUnitContactDTO(
            id = 1,
            controlUnit = NextControlUnitEntity(
                id = 3,
                administrationId = 4,
                areaNote = null,
                controlUnitContactIds = listOf(),
                controlUnitResourceIds = listOf(),
                isArchived = false,
                name = "Control Unit Name",
                termsNote = null,
            ),
            controlUnitId = 2,
            email = null,
            name = "Contact Name",
            note = null,
            phone = null,
        )

        val requestedId = 0

        given(getControlUnitContactById.execute(requestedId)).willReturn(expectedFullControlUnitContact)

        mockMvc.perform(get("/api/v1/control_unit_contacts/$requestedId"))
            .andExpect(status().isOk)

        BDDMockito.verify(getControlUnitContactById).execute(requestedId)
    }

    @Test
    fun `Should get all contacts`() {
        val expectedControlUnitContacts = listOf(
            FullControlUnitContactDTO(
                id = 1,
                controlUnit = NextControlUnitEntity(
                    id = 3,
                    administrationId = 4,
                    areaNote = null,
                    controlUnitContactIds = listOf(),
                    controlUnitResourceIds = listOf(),
                    isArchived = false,
                    name = "Control Unit Name",
                    termsNote = null,
                ),
                controlUnitId = 2,
                email = null,
                name = "Contact Name",
                note = null,
                phone = null,
            ),
            FullControlUnitContactDTO(
                id = 5,
                controlUnit = NextControlUnitEntity(
                    id = 7,
                    administrationId = 8,
                    areaNote = null,
                    controlUnitContactIds = listOf(),
                    controlUnitResourceIds = listOf(),
                    isArchived = false,
                    name = "Control Unit Name 2",
                    termsNote = null,
                ),
                controlUnitId = 6,
                email = null,
                name = "Contact Name 2",
                note = null,
                phone = null,
            )
        )

        given(getControlUnitContacts.execute()).willReturn(expectedControlUnitContacts)

        mockMvc.perform(get("/api/v1/control_unit_contacts"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))

        BDDMockito.verify(getControlUnitContacts).execute()
    }

    @Test
    fun `Should update a contact`() {
        val updatedControlUnitContact = ControlUnitContactEntity(
            id = 1,
            controlUnitId = 2,
            email = null,
            name = "Updated Contact Name",
            note = null,
            phone = null,
        )

        val request = CreateOrUpdateControlUnitContactDataInput(
            id = 1,
            email = null,
            controlUnitId = 2,
            name = "Updated Contact Name",
            note = null,
            phone = null,
        )
        val requestBody = objectMapper.writeValueAsString(request)

        given(createOrUpdateControlUnitContact.execute(controlUnitContact = any())).willReturn(updatedControlUnitContact)

        mockMvc.perform(
            put("/api/v1/control_unit_contacts/1")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }
}
