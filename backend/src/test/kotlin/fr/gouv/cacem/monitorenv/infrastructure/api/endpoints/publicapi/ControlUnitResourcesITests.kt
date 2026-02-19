package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.station.StationEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.ArchiveControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CanDeleteControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.CreateOrUpdateControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.DeleteControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitResourceById
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.GetControlUnitResources
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateControlUnitResourceDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.ControlUnitResources
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.json.JsonMapper

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(ControlUnitResources::class)])
class ControlUnitResourcesITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private val archiveControlUnitResource: ArchiveControlUnitResource = mock()

    @MockitoBean
    private val canDeleteControlUnitResource: CanDeleteControlUnitResource = mock()

    @MockitoBean
    private val createOrUpdateControlUnitResource: CreateOrUpdateControlUnitResource = mock()

    @MockitoBean
    private val deleteControlUnitResource: DeleteControlUnitResource = mock()

    @MockitoBean
    private val getControlUnitResourceById: GetControlUnitResourceById = mock()

    @MockitoBean
    private val getControlUnitResources: GetControlUnitResources = mock()

    @Autowired
    private lateinit var jsonMapper: JsonMapper

    @Test
    fun `archive should archive a control unit resource`() {
        val controlUnitResourceId = 1

        mockMvc
            .perform(
                put("/api/v1/control_unit_resources/$controlUnitResourceId/archive"),
            ).andExpect(status().isOk)

        BDDMockito.verify(archiveControlUnitResource).execute(controlUnitResourceId)
    }

    @Test
    fun `canDelete should check if a control unit resource can be deleted`() {
        val controlUnitResourceId = 1

        given(canDeleteControlUnitResource.execute(controlUnitResourceId)).willReturn(true)

        mockMvc
            .perform(get("/api/v1/control_unit_resources/$controlUnitResourceId/can_delete"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$.value").value(true))

        BDDMockito.verify(canDeleteControlUnitResource).execute(controlUnitResourceId)
    }

    @Test
    fun `create should create a control unit resource`() {
        val expectedCreatedControlUnitResource =
            ControlUnitResourceEntity(
                id = 1,
                controlUnitId = 0,
                isArchived = false,
                name = "Resource Name",
                note = null,
                photo = null,
                stationId = 0,
                type = ControlUnitResourceType.BARGE,
            )

        val newControlUnitData =
            CreateOrUpdateControlUnitResourceDataInput(
                controlUnitId = 0,
                isArchived = false,
                name = "Resource Name",
                note = null,
                photo = null,
                stationId = 0,
                type = ControlUnitResourceType.BARGE,
            )
        val requestBody = jsonMapper.writeValueAsString(newControlUnitData)

        given(createOrUpdateControlUnitResource.execute(controlUnitResource = any())).willReturn(
            expectedCreatedControlUnitResource,
        )

        mockMvc
            .perform(
                post("/api/v1/control_unit_resources")
                    .content(requestBody)
                    .contentType(MediaType.APPLICATION_JSON),
            ).andDo(MockMvcResultHandlers.print())
            .andExpect(status().isCreated)
    }

    @Test
    fun `delete should delete a control unit resource`() {
        val controlUnitResourceId = 1

        mockMvc
            .perform(
                delete("/api/v1/control_unit_resources/$controlUnitResourceId"),
            ).andExpect(status().isOk)

        BDDMockito.verify(deleteControlUnitResource).execute(controlUnitResourceId)
    }

    @Test
    fun `get should get a control unit resource by its ID`() {
        val expectedFullControlUnitResource =
            FullControlUnitResourceDTO(
                controlUnit =
                    ControlUnitEntity(
                        id = 0,
                        administrationId = 0,
                        areaNote = null,
                        departmentAreaInseeCode = null,
                        isArchived = false,
                        name = "Control Unit Name",
                        termsNote = null,
                    ),
                controlUnitResource =
                    ControlUnitResourceEntity(
                        id = 1,
                        controlUnitId = 0,
                        isArchived = false,
                        name = "Resource Name",
                        note = null,
                        photo = null,
                        stationId = 0,
                        type = ControlUnitResourceType.BARGE,
                    ),
                station =
                    StationEntity(
                        id = 0,
                        latitude = 0.0,
                        longitude = 0.0,
                        name = "Control Unit Name",
                    ),
            )

        val requestedId = 1

        given(getControlUnitResourceById.execute(requestedId)).willReturn(expectedFullControlUnitResource)

        mockMvc
            .perform(get("/api/v1/control_unit_resources/$requestedId"))
            .andExpect(status().isOk)

        BDDMockito.verify(getControlUnitResourceById).execute(requestedId)
    }

    @Test
    fun `getAll should get all control unit resources`() {
        val expectedFullControlUnitResources =
            listOf(
                FullControlUnitResourceDTO(
                    controlUnit =
                        ControlUnitEntity(
                            id = 0,
                            administrationId = 0,
                            areaNote = null,
                            departmentAreaInseeCode = null,
                            isArchived = false,
                            name = "Unit Name",
                            termsNote = null,
                        ),
                    controlUnitResource =
                        ControlUnitResourceEntity(
                            id = 1,
                            controlUnitId = 3,
                            isArchived = false,
                            name = "Resource Name",
                            note = null,
                            photo = null,
                            stationId = 0,
                            type = ControlUnitResourceType.BARGE,
                        ),
                    station =
                        StationEntity(
                            id = 0,
                            latitude = 0.0,
                            longitude = 0.0,
                            name = "Station Name",
                        ),
                ),
                FullControlUnitResourceDTO(
                    controlUnit =
                        ControlUnitEntity(
                            id = 0,
                            administrationId = 0,
                            areaNote = null,
                            departmentAreaInseeCode = null,
                            isArchived = false,
                            name = "Unit Name",
                            termsNote = null,
                        ),
                    controlUnitResource =
                        ControlUnitResourceEntity(
                            id = 2,
                            controlUnitId = 0,
                            isArchived = false,
                            name = "Resource Name 2",
                            note = null,
                            photo = null,
                            stationId = 0,
                            type = ControlUnitResourceType.BARGE,
                        ),
                    station =
                        StationEntity(
                            id = 0,
                            latitude = 0.0,
                            longitude = 0.0,
                            name = "Station Name",
                        ),
                ),
            )

        given(getControlUnitResources.execute()).willReturn(expectedFullControlUnitResources)

        mockMvc
            .perform(get("/api/v1/control_unit_resources"))
            .andExpect(status().isOk)
            .andExpect(MockMvcResultMatchers.jsonPath("$", Matchers.hasSize<Any>(2)))

        BDDMockito.verify(getControlUnitResources).execute()
    }

    @Test
    fun `update should update a control unit resource`() {
        val expectedUpdatedControlUnitResource =
            ControlUnitResourceEntity(
                id = 1,
                controlUnitId = 0,
                isArchived = false,
                name = "Updated Resource Name",
                note = null,
                photo = null,
                stationId = 0,
                type = ControlUnitResourceType.BARGE,
            )

        val nextControlUnitData =
            CreateOrUpdateControlUnitResourceDataInput(
                id = 1,
                controlUnitId = 0,
                isArchived = false,
                name = "Updated Resource Name",
                note = null,
                photo = null,
                stationId = 0,
                type = ControlUnitResourceType.BARGE,
            )
        val requestBody = jsonMapper.writeValueAsString(nextControlUnitData)

        given(createOrUpdateControlUnitResource.execute(controlUnitResource = any())).willReturn(
            expectedUpdatedControlUnitResource,
        )

        mockMvc
            .perform(
                put("/api/v1/control_unit_resources/1")
                    .content(requestBody)
                    .contentType(MediaType.APPLICATION_JSON),
            ).andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }
}
