package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v3

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitContact
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits.CreateOrUpdateControlUnitContactDataInputV3
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
@WebMvcTest(value = [(ControlUnitContactsV3::class)])
class ControlUnitContactsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var jsonMapper: JsonMapper

    @MockitoBean
    private val createOrUpdateControlUnitContact: CreateOrUpdateControlUnitContact = mock()

    @Test
    fun `createV3 should create a contact`() {
        // Given
        val requestDataAsDataInput =
            CreateOrUpdateControlUnitContactDataInputV3(
                id = null,
                cellPhone = "0762982109",
                controlUnitId = 2,
                email = "bob@example.org",
                role = "Function Name",
                name = "Contact Name",
                phone = "0033123456789",
                isEmailSubscriptionContact = false,
                isSmsSubscriptionContact = false,
            )
        val requestDataAsJson = jsonMapper.writeValueAsString(requestDataAsDataInput)

        val useCaseInputExpectation =
            ControlUnitContactEntity(
                id = null,
                cellPhone = "0762982109",
                controlUnitId = 2,
                email = "bob@example.org",
                role = "Function Name",
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
                post("/api/v3/control_unit_contacts")
                    .content(requestDataAsJson)
                    .contentType(MediaType.APPLICATION_JSON),
            ).andDo(MockMvcResultHandlers.print())
            // Then
            .andExpect(MockMvcResultMatchers.status().isCreated)

        BDDMockito.verify(createOrUpdateControlUnitContact).execute(useCaseInputExpectation)
    }
}
