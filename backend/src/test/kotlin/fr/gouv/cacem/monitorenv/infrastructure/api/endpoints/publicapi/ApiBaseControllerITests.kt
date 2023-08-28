package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.base.*
import fr.gouv.cacem.monitorenv.domain.use_cases.base.dtos.FullBaseDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateBaseDataInput
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
@WebMvcTest(value = [(ApiBasesController::class)])
class ApiBaseControllerITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var createOrUpdateBase: CreateOrUpdateBase

    @MockBean
    private lateinit var getBaseById: GetBaseById

    @MockBean
    private lateinit var getBases: GetBases

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should create a new base`() {
        val expectedNewBase = BaseEntity(
            id = 1,
            controlUnitResourceIds = listOf(),
            name = "Base Name",
        )

        val request = CreateOrUpdateBaseDataInput(
            controlUnitResourceIds = listOf(),
            name = "Base Name",
        )
        val requestBody = objectMapper.writeValueAsString(request)

        given(createOrUpdateBase.execute(base = any())).willReturn(expectedNewBase)

        mockMvc.perform(
            post("/api/v1/bases")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }

    @Test
    fun `Should get a base by its ID`() {
        val expectedFullBase = FullBaseDTO(
            id = 1,
            controlUnitResourceIds = listOf(),
            controlUnitResources = listOf(),
            name = "Base Name",
        )

        val requestedId = 0

        given(getBaseById.execute(requestedId)).willReturn(expectedFullBase)

        mockMvc.perform(get("/api/v1/bases/$requestedId"))
            .andExpect(status().isOk)

        BDDMockito.verify(getBaseById).execute(requestedId)
    }

    @Test
    fun `Should get all bases`() {
        val expectedBases = listOf(
            FullBaseDTO(
                id = 1,
                controlUnitResourceIds = listOf(),
                controlUnitResources = listOf(),
                name = "Base Name",
            ),
            FullBaseDTO(
                id = 2,
                controlUnitResourceIds = listOf(),
                controlUnitResources = listOf(),
                name = "Base Name 2",
            )
        )

        given(getBases.execute()).willReturn(expectedBases)

        mockMvc.perform(get("/api/v1/bases"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))

        BDDMockito.verify(getBases).execute()
    }

    @Test
    fun `Should update a base`() {
        val updatedBase = BaseEntity(
            id = 1,
            controlUnitResourceIds = listOf(),
            name = "Updated Base Name",
        )

        val request = CreateOrUpdateBaseDataInput(
            id = 1,
            controlUnitResourceIds = listOf(),
            name = "Updated Base Name",
        )
        val requestBody = objectMapper.writeValueAsString(request)

        given(createOrUpdateBase.execute(base = any())).willReturn(updatedBase)

        mockMvc.perform(
            put("/api/v1/bases/1")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }
}
