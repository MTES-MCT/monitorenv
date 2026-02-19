package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi.v1.missions

import com.nhaarman.mockitokotlin2.any
import com.nhaarman.mockitokotlin2.eq
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.CanDeleteMissionResponse
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.BypassActionCheckAndDeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CanDeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CreateOrUpdateMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetEngagedControlUnits
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissionWithRapportNavActions
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissions
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissionsByIds
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.events.UpdateMissionEvent
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateMissionDataInput
import org.assertj.core.api.Assertions.assertThat
import org.hamcrest.Matchers.equalTo
import org.hamcrest.Matchers.nullValue
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest
import org.springframework.context.ApplicationEventPublisher
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultHandlers.log
import org.springframework.test.web.servlet.result.MockMvcResultHandlers.print
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.header
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.request
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import tools.jackson.databind.json.JsonMapper
import java.time.ZonedDateTime

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [LegacyMissions::class, SSEMission::class])
class LegacyMissionsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var createOrUpdateMission: CreateOrUpdateMission

    @MockitoBean
    private val getMissions: GetMissions = mock()

    @MockitoBean
    private val getMissionWithRapportNavActions: GetMissionWithRapportNavActions = mock()

    @MockitoBean
    private val bypassActionCheckAndDeleteMission: BypassActionCheckAndDeleteMission = mock()

    @MockitoBean
    private val canDeleteMission: CanDeleteMission = mock()

    @MockitoBean
    private val getMissionsByIds: GetMissionsByIds = mock()

    @MockitoBean
    private val getEngagedControlUnits: GetEngagedControlUnits = mock()

    @Autowired
    private lateinit var jsonMapper: JsonMapper

    @Autowired
    private lateinit var applicationEventPublisher: ApplicationEventPublisher

    @Autowired
    private lateinit var sseMissionController: SSEMission

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
                createdAtUtc = null,
                updatedAtUtc = null,
            )
        val requestBody = jsonMapper.writeValueAsString(newMissionRequest)
        given(
            createOrUpdateMission.execute(
                mission = newMissionRequest.toMissionEntity(),
            ),
        ).willReturn(expectedNewMission)
        // When
        mockMvc
            .perform(
                post("/api/v1/missions")
                    .content(requestBody)
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andDo(print())
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
                createdAtUtc = null,
                updatedAtUtc = null,
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
                searchQuery = any(),
                withLegacyControlPlans = eq(true),
            ),
        ).willReturn(listOf(expectedFirstMission))

        // When
        mockMvc
            .perform(get("/api/v1/missions"))
            // Then
            .andDo(print())
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
                createdAtUtc = null,
                updatedAtUtc = null,
            )
        given(
            getMissionsByIds.execute(any()),
        ).willReturn(listOf(expectedFirstMission))

        // When
        mockMvc
            .perform(get("/api/v1/missions/find?ids=55,52"))
            // Then
            .andDo(print())
            .andExpect(status().isOk)
    }

    @Test
    fun `Should get specific mission when requested by Id`() {
        // Given
        val requestedId = 0

        val expectedFirstMission =
            MissionDetailsDTO(
                mission =
                    MissionEntity(
                        id = 10,
                        missionTypes = listOf(MissionTypeEnum.SEA),
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        isDeleted = false,
                        missionSource = MissionSourceEnum.MONITORFISH,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        isGeometryComputedFromControls = false,
                        createdAtUtc = null,
                        updatedAtUtc = null,
                    ),
            )

        // we test only if the route is called with the right arg
        given(getMissionWithRapportNavActions.execute(requestedId)).willReturn(expectedFirstMission)

        // When
        mockMvc
            .perform(get("/api/v1/missions/$requestedId"))
            // Then
            .andExpect(status().isOk)
            .andExpect(
                jsonPath(
                    "$.missionTypes[0]",
                    equalTo(MissionTypeEnum.SEA.toString()),
                ),
            )
        verify(getMissionWithRapportNavActions).execute(requestedId)
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
                createdAtUtc = null,
                updatedAtUtc = null,
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
                createdAtUtc = null,
                updatedAtUtc = null,
            )
        given(
            createOrUpdateMission.execute(
                mission = requestBody.toMissionEntity(),
            ),
        ).willReturn(expectedUpdatedMission)
        // When
        mockMvc
            .perform(
                post("/api/v1/missions/14")
                    .content(jsonMapper.writeValueAsString(requestBody))
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
        mockMvc
            .perform(delete("/api/v1/missions/20"))
            .andExpect(status().isOk)
        verify(bypassActionCheckAndDeleteMission).execute(20)
    }

    @Test
    fun `canDelete() should check if a mission can be deleted`() {
        val missionId = 42
        val source = MissionSourceEnum.MONITORFISH

        given(canDeleteMission.execute(missionId = missionId, source = source))
            .willReturn(CanDeleteMissionResponse(true, listOf()))

        mockMvc
            .perform(get("/api/v1/missions/$missionId/can_delete?source=$source"))
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

        mockMvc
            .perform(get("/api/v1/missions/$missionId/can_delete?source=$source"))
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
        mockMvc
            .perform(get("/api/v1/missions/engaged_control_units"))
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
                        createdAtUtc = null,
                        updatedAtUtc = null,
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
        }.start()

        // Then
        val missionUpdateEvent =
            mockMvc
                .perform(get("/api/v1/missions/sse"))
                .andExpect(status().isOk)
                .andExpect(request().asyncStarted())
                .andExpect(request().asyncResult(nullValue()))
                .andExpect(header().string("Content-Type", "text/event-stream"))
                .andDo(log())
                .andReturn()
                .response
                .contentAsString

        assertThat(missionUpdateEvent).contains("event:MISSION_UPDATE")
        assertThat(missionUpdateEvent)
            .containsIgnoringWhitespaces(
                """
            {
              "id": 132,
              "missionTypes": [
                "SEA"
              ],
              "controlUnits": [],
              "openBy": null,
              "completedBy": null,
              "observationsByUnit": null,
              "observationsCacem": null,
              "observationsCnsp": null,
              "facade": "Outre-Mer",
              "geom": {
                "type": "MultiPolygon",
                "coordinates": [
                  [
                    [
                      [-4.54877817, 48.30555988],
                      [-4.54997332, 48.30597601],
                      [-4.54998501, 48.30718823],
                      [-4.5487929, 48.30677461],
                      [-4.54877817, 48.30555988]
                    ]
                  ]
                ]
              },
              "startDateTimeUtc": "2022-01-15T04:50:09Z",
              "endDateTimeUtc": "2022-01-23T20:29:03Z",
              "createdAtUtc": null,
              "updatedAtUtc": null,
              "envActions": [],
              "missionSource": "MONITORFISH",
              "hasMissionOrder": false,
              "isUnderJdp": false,
              "isGeometryComputedFromControls": false,
              "hasRapportNavActions": null
            }""",
            )
    }
}
