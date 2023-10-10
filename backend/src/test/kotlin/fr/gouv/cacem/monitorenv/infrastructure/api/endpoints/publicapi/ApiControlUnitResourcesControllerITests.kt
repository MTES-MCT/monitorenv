package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitResourceById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitResources
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitResourceDataInput
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
@WebMvcTest(value = [(ApiControlUnitResourcesController::class)])
class ApiControlUnitResourcesControllerITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var createOrUpdateControlUnitResource: CreateOrUpdateControlUnitResource

    @MockBean
    private lateinit var getControlUnitResourceById: GetControlUnitResourceById

    @MockBean
    private lateinit var getControlUnitResources: GetControlUnitResources

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should create a resource`() {
        val expectedCreatedControlUnitResource = ControlUnitResourceEntity(
            id = 1,
            baseId = 0,
            controlUnitId = 0,
            name = "Resource Name",
            note = null,
            photo = null,
            type = ControlUnitResourceType.BARGE,
        )

        val newControlUnitData = CreateOrUpdateControlUnitResourceDataInput(
            baseId = 0,
            controlUnitId = 0,
            name = "Resource Name",
            note = null,
            photo = null,
            type = ControlUnitResourceType.BARGE,
        )
        val requestBody = objectMapper.writeValueAsString(newControlUnitData)

        given(createOrUpdateControlUnitResource.execute(controlUnitResource = any())).willReturn(
            expectedCreatedControlUnitResource
        )

        mockMvc.perform(
            post("/api/v1/control_unit_resources")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isCreated)
    }

    @Test
    fun `Should get a resource by its ID`() {
        val expectedFullControlUnitResource = FullControlUnitResourceDTO(
            base = BaseEntity(
                id = 0,
                latitude = 0.0,
                longitude = 0.0,
                name = "Control Unit Name",
            ),
            controlUnit = ControlUnitEntity(
                id = 0,
                administrationId = 0,
                areaNote = null,
                department = null,
                isArchived = false,
                name = "Control Unit Name",
                termsNote = null,
            ),
            controlUnitResource = ControlUnitResourceEntity(
                id = 1,
                baseId = 0,
                controlUnitId = 0,
                name = "Resource Name",
                note = null,
                photo = null,
                type = ControlUnitResourceType.BARGE,
            ),
        )

        val requestedId = 1

        given(getControlUnitResourceById.execute(requestedId)).willReturn(expectedFullControlUnitResource)

        mockMvc.perform(get("/api/v1/control_unit_resources/$requestedId"))
            .andExpect(status().isOk)

        BDDMockito.verify(getControlUnitResourceById).execute(requestedId)
    }

    @Test
    fun `Should get all resources`() {
        val expectedFullControlUnitResources = listOf(
            FullControlUnitResourceDTO(
                base = BaseEntity(
                    id = 0,
                    latitude = 0.0,
                    longitude = 0.0,
                    name = "Base Name",
                ),
                controlUnit = ControlUnitEntity(
                    id = 0,
                    administrationId = 0,
                    areaNote = null,
                    department = null,
                    isArchived = false,
                    name = "Unit Name",
                    termsNote = null,
                ),
                controlUnitResource = ControlUnitResourceEntity(
                    id = 1,
                    baseId = 0,
                    controlUnitId = 3,
                    name = "Resource Name",
                    note = null,
                    photo = null,
                    type = ControlUnitResourceType.BARGE,
                ),
            ),

            FullControlUnitResourceDTO(
                base = BaseEntity(
                    id = 0,
                    latitude = 0.0,
                    longitude = 0.0,
                    name = "Base Name",
                ),
                controlUnit = ControlUnitEntity(
                    id = 0,
                    administrationId = 0,
                    areaNote = null,
                    department = null,
                    isArchived = false,
                    name = "Unit Name",
                    termsNote = null,
                ),
                controlUnitResource = ControlUnitResourceEntity(
                    id = 2,
                    baseId = 0,
                    controlUnitId = 0,
                    name = "Resource Name 2",
                    note = null,
                    photo = null,
                    type = ControlUnitResourceType.BARGE,
                ),
            )
        )

        given(getControlUnitResources.execute()).willReturn(expectedFullControlUnitResources)

        mockMvc.perform(get("/api/v1/control_unit_resources"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))

        BDDMockito.verify(getControlUnitResources).execute()
    }

    @Test
    fun `Should update a resource`() {
        val expectedUpdatedControlUnitResource = ControlUnitResourceEntity(
            id = 1,
            baseId = 0,
            controlUnitId = 0,
            name = "Updated Resource Name",
            note = null,
            photo = null,
            type = ControlUnitResourceType.BARGE,
        )

        val nextControlUnitData = CreateOrUpdateControlUnitResourceDataInput(
            id = 1,
            baseId = 0,
            controlUnitId = 0,
            name = "Updated Resource Name",
            note = null,
            photo = null,
            type = ControlUnitResourceType.BARGE,
        )
        val requestBody = objectMapper.writeValueAsString(nextControlUnitData)

        given(createOrUpdateControlUnitResource.execute(controlUnitResource = any())).willReturn(
            expectedUpdatedControlUnitResource
        )

        mockMvc.perform(
            put("/api/v1/control_unit_resources/1")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }
}
