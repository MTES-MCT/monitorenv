package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.*
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateAdministrationDataInput
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
@WebMvcTest(value = [(ApiAdministrationsController::class)])
class ApiAdministrationsControllerITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var createOrUpdateAdministration: CreateOrUpdateAdministration

    @MockBean
    private lateinit var getAdministrationById: GetAdministrationById

    @MockBean
    private lateinit var getAdministrations: GetAdministrations

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should create a new administration`() {
        val expectedNewAdministration = AdministrationEntity(
            id = 1,
            controlUnitIds = listOf(),
            name = "Administration Name",
        )

        val request = CreateOrUpdateAdministrationDataInput(
            controlUnitIds = listOf(),
            name = "Administration Name",
        )
        val requestBody = objectMapper.writeValueAsString(request)

        given(createOrUpdateAdministration.execute(administration = any())).willReturn(expectedNewAdministration)

        mockMvc.perform(
            post("/api/v1/administrations")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }

    @Test
    fun `Should get an administration by its ID`() {
        val expectedFullAdministration = FullAdministrationDTO(
            id = 1,
            controlUnitIds = listOf(),
            controlUnits = listOf(),
            name = "Administration Name",
        )

        val requestedId = 0

        given(getAdministrationById.execute(requestedId)).willReturn(expectedFullAdministration)

        mockMvc.perform(get("/api/v1/administrations/$requestedId"))
            .andExpect(status().isOk)

        BDDMockito.verify(getAdministrationById).execute(requestedId)
    }

    @Test
    fun `Should get all administrations`() {
        val expectedAdministrations = listOf(
            FullAdministrationDTO(
                id = 1,
                controlUnitIds = listOf(),
                controlUnits = listOf(),
                name = "Administration Name",
            ),
            FullAdministrationDTO(
                id = 2,
                controlUnitIds = listOf(),
                controlUnits = listOf(),
                name = "Administration Name 2",
            )
        )

        given(getAdministrations.execute()).willReturn(expectedAdministrations)

        mockMvc.perform(get("/api/v1/administrations"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))

        BDDMockito.verify(getAdministrations).execute()
    }

    @Test
    fun `Should update an administration`() {
        val updatedAdministration = AdministrationEntity(
            id = 1,
            controlUnitIds = listOf(),
            name = "Updated Administration Name",
        )

        val request = CreateOrUpdateAdministrationDataInput(
            id = 1,
            controlUnitIds = listOf(),
            name = "Updated Administration Name",
        )
        val requestBody = objectMapper.writeValueAsString(request)

        given(createOrUpdateAdministration.execute(administration = any())).willReturn(updatedAdministration)

        mockMvc.perform(
            put("/api/v1/administrations/1")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }
}
