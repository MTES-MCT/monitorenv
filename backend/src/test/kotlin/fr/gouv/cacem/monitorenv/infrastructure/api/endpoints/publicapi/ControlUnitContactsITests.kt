package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.DeleteControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContactById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContacts
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateControlUnitContactDataInputV1
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitContactDataInputV2
import org.hamcrest.Matchers
import org.junit.jupiter.api.Test
import org.mockito.BDDMockito
import org.mockito.BDDMockito.given
import org.mockito.Mockito.mock
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import tools.jackson.databind.json.JsonMapper

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(ControlUnitContacts::class)])
class ControlUnitContactsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var jsonMapper: JsonMapper

    @MockitoBean
    private val createOrUpdateControlUnitContact: CreateOrUpdateControlUnitContact = mock()

    @MockitoBean
    private val deleteControlUnitContact: DeleteControlUnitContact = mock()

    @MockitoBean
    private val getControlUnitContactById: GetControlUnitContactById = mock()

    @MockitoBean
    private val getControlUnitContacts: GetControlUnitContacts = mock()

    @Test
    fun `createV1 should create a contact`() {
        // Given
        val requestDataAsDataInput =
            CreateControlUnitContactDataInputV1(
                id = null,
                controlUnitId = 2,
                email = "bob@example.org",
                name = "Contact Name",
                phone = "0033123456789",
            )
        val requestDataAsJson = jsonMapper.writeValueAsString(requestDataAsDataInput)

        val useCaseInputExpectation =
            ControlUnitContactEntity(
                id = null,
                controlUnitId = 2,
                email = "bob@example.org",
                isEmailSubscriptionContact = false,
                isSmsSubscriptionContact = false,
                name = "Contact Name",
                phone = "0033123456789",
            )
        val useCaseOutputMock =
            useCaseInputExpectation.copy(
                id = 1,
            )
        given(createOrUpdateControlUnitContact.execute(useCaseInputExpectation))
            .willReturn(useCaseOutputMock)

        // When
        mockMvc
            .perform(
                post("/api/v1/control_unit_contacts")
                    .content(requestDataAsJson)
                    .contentType(MediaType.APPLICATION_JSON),
            ).andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(MockMvcResultMatchers.status().isCreated)

        BDDMockito.verify(createOrUpdateControlUnitContact).execute(useCaseInputExpectation)
    }

    @Test
    fun `createV2 should create a contact`() {
        // Given
        val newControlUnitContactData =
            CreateOrUpdateControlUnitContactDataInputV2(
                id = null,
                controlUnitId = 2,
                email = "bob@example.org",
                isEmailSubscriptionContact = false,
                isSmsSubscriptionContact = false,
                name = "Contact Name",
                phone = "0033123456789",
            )
        val requestDataAsJson = jsonMapper.writeValueAsString(newControlUnitContactData)

        val useCaseInputExpectation =
            ControlUnitContactEntity(
                id = null,
                controlUnitId = 2,
                email = "bob@example.org",
                isEmailSubscriptionContact = false,
                isSmsSubscriptionContact = false,
                name = "Contact Name",
                phone = "0033123456789",
            )
        val useCaseOutputMock =
            useCaseInputExpectation.copy(
                id = 1,
            )
        given(createOrUpdateControlUnitContact.execute(useCaseInputExpectation))
            .willReturn(useCaseOutputMock)

        // When
        mockMvc
            .perform(
                post("/api/v2/control_unit_contacts")
                    .content(requestDataAsJson)
                    .contentType(MediaType.APPLICATION_JSON),
            ).andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(MockMvcResultMatchers.status().isCreated)

        BDDMockito.verify(createOrUpdateControlUnitContact).execute(useCaseInputExpectation)
    }

    @Test
    fun `deleteV1() should delete a contact`() {
        // Given
        val requestedId = 1

        // When
        mockMvc
            .perform(delete("/api/v1/control_unit_contacts/$requestedId"))
            .andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(MockMvcResultMatchers.status().isNoContent)

        BDDMockito.verify(deleteControlUnitContact).execute(requestedId)
    }

    @Test
    fun `getV1 should get a contact by its ID`() {
        // Given
        val requestedId = 1

        val useCaseOutputMock =
            FullControlUnitContactDTO(
                controlUnit =
                    ControlUnitEntity(
                        id = 2,
                        administrationId = 3,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Unit Name",
                        termsNote = null,
                    ),
                controlUnitContact =
                    ControlUnitContactEntity(
                        id = 1,
                        controlUnitId = 2,
                        email = "bob@example.org",
                        isEmailSubscriptionContact = false,
                        isSmsSubscriptionContact = false,
                        name = "Contact Name",
                        phone = "0033123456789",
                    ),
            )
        given(getControlUnitContactById.execute(requestedId)).willReturn(useCaseOutputMock)

        // When
        mockMvc
            .perform(get("/api/v1/control_unit_contacts/$requestedId"))
            .andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)

        BDDMockito.verify(getControlUnitContactById).execute(requestedId)
    }

    @Test
    fun `getAllV1 should get all contacts`() {
        // Given
        val useCaseOutputMock =
            listOf(
                FullControlUnitContactDTO(
                    controlUnit =
                        ControlUnitEntity(
                            id = 2,
                            administrationId = 3,
                            areaNote = null,
                            departmentAreaInseeCode = null,
                            isArchived = false,
                            name = "Unit Name",
                            termsNote = null,
                        ),
                    controlUnitContact =
                        ControlUnitContactEntity(
                            id = 1,
                            controlUnitId = 2,
                            email = "bob@example.org",
                            isEmailSubscriptionContact = false,
                            isSmsSubscriptionContact = false,
                            name = "Contact Name",
                            phone = "0033123456789",
                        ),
                ),
                FullControlUnitContactDTO(
                    controlUnit =
                        ControlUnitEntity(
                            id = 5,
                            administrationId = 6,
                            areaNote = null,
                            departmentAreaInseeCode = null,
                            isArchived = false,
                            name = "Unit Name",
                            termsNote = null,
                        ),
                    controlUnitContact =
                        ControlUnitContactEntity(
                            id = 4,
                            controlUnitId = 5,
                            email = "bob@example.org",
                            isEmailSubscriptionContact = false,
                            isSmsSubscriptionContact = false,
                            name = "Contact Name 2",
                            phone = "0033123456789",
                        ),
                ),
            )
        given(getControlUnitContacts.execute()).willReturn(useCaseOutputMock)

        // When
        mockMvc
            .perform(get("/api/v1/control_unit_contacts"))
            .andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.length()", Matchers.equalTo(2)))

        BDDMockito.verify(getControlUnitContacts).execute()
    }

    @Test
    fun `patchV1 should patch a contact`() {
        // Given
        val requestedId = 1
        val requestDataAsJson =
            jsonMapper
                .createObjectNode()
                .apply {
                    put("id", 1)
                    put("name", "Updated Contact Name")
                }.toString()

        val firstUseCaseOutputMock =
            FullControlUnitContactDTO(
                controlUnit =
                    ControlUnitEntity(
                        id = 2,
                        administrationId = 3,
                        areaNote = "Area Note",
                        departmentAreaInseeCode = "12345",
                        isArchived = false,
                        name = "Unit Name",
                        termsNote = "Terms Note",
                    ),
                controlUnitContact =
                    ControlUnitContactEntity(
                        id = 1,
                        controlUnitId = 2,
                        email = "bob@example.org",
                        isEmailSubscriptionContact = false,
                        isSmsSubscriptionContact = false,
                        name = "Contact Name",
                        phone = "0033123456789",
                    ),
            )
        given(getControlUnitContactById.execute(requestedId))
            .willReturn(firstUseCaseOutputMock)

        val secondUseCaseInputExpectation =
            ControlUnitContactEntity(
                id = 1,
                controlUnitId = 2,
                email = "bob@example.org",
                isEmailSubscriptionContact = false,
                isSmsSubscriptionContact = false,
                name = "Updated Contact Name", // Updated property
                phone = "0033123456789",
            )
        val secondUseCaseOutputMock = secondUseCaseInputExpectation
        given(createOrUpdateControlUnitContact.execute(secondUseCaseInputExpectation))
            .willReturn(secondUseCaseOutputMock)

        // When
        mockMvc
            .perform(
                patch("/api/v1/control_unit_contacts/$requestedId")
                    .content(requestDataAsJson)
                    .contentType(MediaType.APPLICATION_JSON),
            ).andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)

        BDDMockito.verify(getControlUnitContactById).execute(requestedId)
        BDDMockito.verify(createOrUpdateControlUnitContact).execute(secondUseCaseInputExpectation)
    }

    @Test
    fun `updateV1 should update a contact`() {
        // Given
        val requestedId = 1
        val requestDataAsJson =
            jsonMapper
                .createObjectNode()
                .apply {
                    put("id", 1)
                    put("email", "bob@example.org")
                    put("controlUnitId", 2)
                    put("name", "Updated Contact Name")
                    put("phone", "0033123456789")
                }.toString()

        val firstUseCaseOutputMock =
            FullControlUnitContactDTO(
                controlUnit =
                    ControlUnitEntity(
                        id = 2,
                        administrationId = 3,
                        areaNote = "Area Note",
                        departmentAreaInseeCode = "12345",
                        isArchived = false,
                        name = "Unit Name",
                        termsNote = "Terms Note",
                    ),
                controlUnitContact =
                    ControlUnitContactEntity(
                        id = 1,
                        controlUnitId = 2,
                        email = "bob@example.org",
                        isEmailSubscriptionContact = false,
                        isSmsSubscriptionContact = false,
                        name = "Contact Name",
                        phone = "0033123456789",
                    ),
            )
        given(getControlUnitContactById.execute(requestedId))
            .willReturn(firstUseCaseOutputMock)

        val secondUseCaseInputExpectation =
            ControlUnitContactEntity(
                id = 1,
                controlUnitId = 2,
                email = "bob@example.org",
                isEmailSubscriptionContact = false,
                isSmsSubscriptionContact = false,
                name = "Updated Contact Name", // Updated property
                phone = "0033123456789",
            )
        val secondUseCaseOutputMock = secondUseCaseInputExpectation
        given(createOrUpdateControlUnitContact.execute(secondUseCaseInputExpectation))
            .willReturn(secondUseCaseOutputMock)

        // When
        mockMvc
            .perform(
                put("/api/v1/control_unit_contacts/$requestedId")
                    .content(requestDataAsJson)
                    .contentType(MediaType.APPLICATION_JSON),
            ).andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(MockMvcResultMatchers.status().isOk)

        BDDMockito.verify(getControlUnitContactById).execute(requestedId)
        BDDMockito.verify(createOrUpdateControlUnitContact).execute(secondUseCaseInputExpectation)
    }
}
