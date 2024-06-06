package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.CanDeleteMissionResponse
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.*
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.events.UpdateMissionEvent
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateMissionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.missions.LegacyMissions
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.missions.SSEMission
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v2.NewMissions
import org.assertj.core.api.Assertions.assertThat
import org.hamcrest.Matchers.equalTo
import org.hamcrest.Matchers.nullValue
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.verify
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import java.time.ZonedDateTime

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [LegacyMissions::class, SSEMission::class, NewMissions::class])
class ApiLegacyMissionsITests {
    @Autowired private lateinit var mockMvc: MockMvc

    @MockBean private lateinit var createOrUpdateMission: CreateOrUpdateMission

    @MockBean private lateinit var getMissions: GetMissions

    @MockBean private lateinit var getMissionById: GetMissionById

    @MockBean private lateinit var deleteMission: DeleteMission

    @MockBean
    private lateinit var bypassActionCheckAndDeleteMission: BypassActionCheckAndDeleteMission

    @MockBean private lateinit var canDeleteMission: CanDeleteMission

    @MockBean private lateinit var getMissionsByIds: GetMissionsByIds

    @MockBean private lateinit var getEngagedControlUnits: GetEngagedControlUnits

    @Autowired private lateinit var objectMapper: ObjectMapper

    @Autowired private lateinit var applicationEventPublisher: ApplicationEventPublisher

    @Autowired private lateinit var sseMissionController: SSEMission

    @Test
    fun `Should create a new mission`() {
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        // Given

        val expectedNewMission =
            MissionEntity(
                id = 10,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = polygon,
                observationsCnsp = null,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                updatedAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORFISH,
                hasMissionOrder = true,
                isUnderJdp = true,
                isGeometryComputedFromControls = false,
            )
        val newMissionRequest =
            CreateOrUpdateMissionDataInput(
                missionTypes = listOf(MissionTypeEnum.LAND),
                observationsCnsp = null,
                facade = "Outre-Mer",
                geom = polygon,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                missionSource = MissionSourceEnum.MONITORFISH,
                hasMissionOrder = true,
                isUnderJdp = true,
                isGeometryComputedFromControls = false,
            )
        val requestBody = objectMapper.writeValueAsString(newMissionRequest)
        given(
            createOrUpdateMission.execute(
                mission = newMissionRequest.toMissionEntity(),
            ),
        )
            .willReturn(expectedNewMission)
        // When
        mockMvc.perform(
            post("/api/v1/missions")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.createdAtUtc", equalTo("2022-01-23T20:29:03Z")))
            .andExpect(jsonPath("$.updatedAtUtc", equalTo("2022-01-23T20:29:03Z")))
    }

    @Test
    fun `Should get all missions`() {
        // Given
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val expectedFirstMission =
            MissionEntity(
                id = 10,
                missionTypes = listOf(MissionTypeEnum.SEA),
                facade = "Outre-Mer",
                geom = polygon,
                observationsCnsp = null,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORFISH,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            )
        given(
            getMissions.execute(
                startedAfterDateTime = any(),
                startedBeforeDateTime = any(),
                missionSources = any(),
                missionTypes = any(),
                missionStatuses = any(),
                seaFronts = any(),
                controlUnitIds = any(),
                pageNumber = any(),
                pageSize = any(),
            ),
        )
            .willReturn(listOf(expectedFirstMission))

        // When
        mockMvc.perform(get("/api/v1/missions"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }

    @Test
    fun `Should get all missions included in ids`() {
        // Given
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val expectedFirstMission =
            MissionEntity(
                id = 10,
                missionTypes = listOf(MissionTypeEnum.SEA),
                facade = "Outre-Mer",
                geom = polygon,
                observationsCnsp = null,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORFISH,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            )
        given(
            getMissionsByIds.execute(any()),
        )
            .willReturn(listOf(expectedFirstMission))

        // When
        mockMvc.perform(get("/api/v1/missions/find?ids=55,52"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }

    @Test
    fun `Should get specific mission when requested by Id`() {
        // Given
        val requestedId = 0

        val expectedFirstMission =
            MissionDTO(
                mission = MissionEntity(
                    id = 10,
                    missionTypes = listOf(MissionTypeEnum.SEA),
                    startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    isDeleted = false,
                    missionSource = MissionSourceEnum.MONITORFISH,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                ),
            )

        // we test only if the route is called with the right arg
        given(getMissionById.execute(requestedId)).willReturn(expectedFirstMission)

        // When
        mockMvc.perform(get("/api/v1/missions/$requestedId"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.missionTypes[0]", equalTo(MissionTypeEnum.SEA.toString())))
        verify(getMissionById).execute(requestedId)
    }

    @Test
    fun `update mission should return updated mission`() {
        // Given
        val expectedUpdatedMission =

            MissionEntity(
                id = 14,
                missionTypes = listOf(MissionTypeEnum.SEA),
                observationsCacem = "updated observations",
                observationsCnsp = "updated observations",
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORFISH,
                hasMissionOrder = true,
                isUnderJdp = true,
                isGeometryComputedFromControls = false,
            )

        val requestBody =
            CreateOrUpdateMissionDataInput(
                id = 14,
                missionTypes = listOf(MissionTypeEnum.SEA),
                observationsCacem = "updated observations",
                observationsCnsp = "updated observations",
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                missionSource = MissionSourceEnum.MONITORFISH,
                hasMissionOrder = true,
                isUnderJdp = true,
                isGeometryComputedFromControls = false,
            )
        given(
            createOrUpdateMission.execute(
                mission = requestBody.toMissionEntity(),
            ),
        )
            .willReturn(expectedUpdatedMission)
        // When
        mockMvc.perform(
            post("/api/v1/missions/14")
                .content(objectMapper.writeValueAsString(requestBody))
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(status().isOk)
            .andExpect(
                jsonPath(
                    "$.observationsCnsp",
                    equalTo(expectedUpdatedMission.observationsCnsp),
                ),
            )
    }

    @Test
    fun `Should delete mission`() {
        mockMvc.perform(delete("/api/v1/missions/20")).andExpect(status().isOk)
        Mockito.verify(bypassActionCheckAndDeleteMission).execute(20)
    }

    @Test
    fun `Should delete mission with api v2`() {
        mockMvc.perform(delete("/api/v2/missions/20?source=MONITORFISH")).andExpect(status().isOk)
        Mockito.verify(deleteMission).execute(20, MissionSourceEnum.MONITORFISH)
    }

    @Test
    fun `canDelete() should check if a mission can be deleted`() {
        val missionId = 42
        val source = MissionSourceEnum.MONITORFISH

        given(canDeleteMission.execute(missionId = missionId, source = source))
            .willReturn(CanDeleteMissionResponse(true, listOf()))

        mockMvc.perform(get("/api/v1/missions/$missionId/can_delete?source=$source"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.canDelete").value(true))
    }

    @Test
    fun `canDelete() should return list of sources if a mission can't be deleted`() {
        val missionId = 34
        val source = MissionSourceEnum.MONITORFISH

        given(canDeleteMission.execute(missionId = missionId, source = source))
            .willReturn(
                CanDeleteMissionResponse(
                    canDelete = false,
                    sources = listOf(MissionSourceEnum.MONITORENV),
                ),
            )

        mockMvc.perform(get("/api/v1/missions/$missionId/can_delete?source=$source"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.canDelete").value(false))
    }

    @Test
    fun `Should get all engaged control units`() {
        // Given
        given(getEngagedControlUnits.execute())
            .willReturn(
                listOf(
                    Pair(
                        LegacyControlUnitEntity(
                            id = 123,
                            administration = "Admin",
                            resources = listOf(),
                            isArchived = false,
                            name = "Control Unit Name",
                        ),
                        listOf(MissionSourceEnum.MONITORFISH),
                    ),
                ),
            )

        // When
        mockMvc.perform(get("/api/v1/missions/engaged_control_units"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].controlUnit.name", equalTo("Control Unit Name")))
            .andExpect(jsonPath("$[0].missionSources[0]", equalTo("MONITORFISH")))
    }

    @Test
    fun `Should receive an event When listening to mission updates`() {
        // Given
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        val updateMissionEvent =
            UpdateMissionEvent(
                mission =
                MissionEntity(
                    id = 132,
                    missionTypes = listOf(MissionTypeEnum.SEA),
                    facade = "Outre-Mer",
                    geom = polygon,
                    observationsCnsp = null,
                    startDateTimeUtc =
                    ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    endDateTimeUtc =
                    ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                    isDeleted = false,
                    missionSource = MissionSourceEnum.MONITORFISH,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                ),
            )

        // When we send an event from another thread
        object : Thread() {
            override fun run() {
                try {
                    sleep(250)
                    applicationEventPublisher.publishEvent(updateMissionEvent)
                } catch (ex: InterruptedException) {
                    println(ex)
                }
            }
        }
            .start()

        // Then
        val missionUpdateEvent =
            mockMvc.perform(get("/api/v1/missions/sse"))
                .andExpect(status().isOk)
                .andExpect(request().asyncStarted())
                .andExpect(request().asyncResult(nullValue()))
                .andExpect(header().string("Content-Type", "text/event-stream"))
                .andDo(MockMvcResultHandlers.log())
                .andReturn()
                .response
                .contentAsString

        assertThat(missionUpdateEvent).contains("event:MISSION_UPDATE")
        assertThat(missionUpdateEvent)
            .contains(
                "data:{\"id\":132,\"missionTypes\":[\"SEA\"],\"controlUnits\":[],\"openBy\":null,\"completedBy\":null,\"observationsCacem\":null,\"observationsCnsp\":null,\"facade\":\"Outre-Mer\",\"geom\":{\"type\":\"MultiPolygon\",\"coordinates\":[[[[-4.54877817,48.30555988],[-4.54997332,48.30597601],[-4.54998501,48.30718823],[-4.5487929,48.30677461],[-4.54877817,48.30555988]]]]},\"startDateTimeUtc\":\"2022-01-15T04:50:09Z\",\"endDateTimeUtc\":\"2022-01-23T20:29:03Z\",\"createdAtUtc\":null,\"updatedAtUtc\":null,\"envActions\":[],\"missionSource\":\"MONITORFISH\",\"hasMissionOrder\":false,\"isUnderJdp\":false,\"isGeometryComputedFromControls\":false,\"hasRapportNavActions\":null}",
            )
    }
}
