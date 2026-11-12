package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v2

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.DeleteControlUnitContact
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContactById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitContacts
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits.CreateOrUpdateControlUnitContactDataInputV2
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import tools.jackson.databind.json.JsonMapper

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(ControlUnitContactsV2::class)])
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
}
