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
class ApiBasesControllerITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var canDeleteBase: CanDeleteBase

    @MockBean
    private lateinit var createOrUpdateBase: CreateOrUpdateBase

    @MockBean
    private lateinit var deleteBase: DeleteBase

    @MockBean
    private lateinit var getBaseById: GetBaseById

    @MockBean
    private lateinit var getBases: GetBases

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `canDelete() should check if a base can be deleted`() {
        val baseId = 1

        given(canDeleteBase.execute(baseId)).willReturn(true)

        mockMvc.perform(get("/api/v1/bases/$baseId/can_delete"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.value").value(true))

        BDDMockito.verify(canDeleteBase).execute(baseId)
    }

    @Test
    fun `create() should create a base`() {
        val expectedCreatedBase = BaseEntity(
            id = 1,
            latitude = 0.0,
            longitude = 0.0,
            name = "Base Name"
        )

        val newBaseData = CreateOrUpdateBaseDataInput(
            latitude = 0.0,
            longitude = 0.0,
            name = "Base Name"
        )
        val requestBody = objectMapper.writeValueAsString(newBaseData)

        given(createOrUpdateBase.execute(base = any())).willReturn(expectedCreatedBase)

        mockMvc.perform(
            post("/api/v1/bases")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isCreated)
    }

    @Test
    fun `delete() should delete a base`() {
        val baseId = 1

        mockMvc.perform(
            delete("/api/v1/bases/$baseId")
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)

        BDDMockito.verify(deleteBase).execute(baseId)
    }

    @Test
    fun `get() should get a base by its ID`() {
        val expectedFullBase = FullBaseDTO(
            base = BaseEntity(
                id = 1,
                latitude = 0.0,
                longitude = 0.0,
                name = "Base Name"
            ),
            controlUnitResources = listOf()
        )

        val requestedId = 1

        given(getBaseById.execute(requestedId)).willReturn(expectedFullBase)

        mockMvc.perform(get("/api/v1/bases/$requestedId"))
            .andExpect(status().isOk)

        BDDMockito.verify(getBaseById).execute(requestedId)
    }

    @Test
    fun `getAll() should get all bases`() {
        val expectedFullBases = listOf(
            FullBaseDTO(
                base = BaseEntity(
                    id = 1,
                    latitude = 0.0,
                    longitude = 0.0,
                    name = "Base Name"
                ),
                controlUnitResources = listOf()
            ),

            FullBaseDTO(
                base = BaseEntity(
                    id = 2,
                    latitude = 0.0,
                    longitude = 0.0,
                    name = "Base Name 2"
                ),
                controlUnitResources = listOf()
            )
        )

        given(getBases.execute()).willReturn(expectedFullBases)

        mockMvc.perform(get("/api/v1/bases"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))

        BDDMockito.verify(getBases).execute()
    }

    @Test
    fun `update() should update a base`() {
        val expectedUpdatedBase = BaseEntity(
            id = 1,
            latitude = 0.0,
            longitude = 0.0,
            name = "Updated Base Name"
        )

        val nextBaseData = CreateOrUpdateBaseDataInput(
            id = 1,
            latitude = 0.0,
            longitude = 0.0,
            name = "Updated Base Name"
        )
        val requestBody = objectMapper.writeValueAsString(nextBaseData)

        given(createOrUpdateBase.execute(base = any())).willReturn(expectedUpdatedBase)

        mockMvc.perform(
            put("/api/v1/bases/1")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON)
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }
}
