package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.missions.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.missions.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CreateOrUpdateMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.DeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissionById
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetMissions
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.CreateOrUpdateMissionDataInput
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.verify
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime
import java.util.UUID

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [(ApiMissionsController::class)])
class ApiMissionsControllerITests {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var createOrUpdateMission: CreateOrUpdateMission

    @MockBean
    private lateinit var getMissions: GetMissions

    @MockBean
    private lateinit var getMissionById: GetMissionById

    @MockBean
    private lateinit var deleteMission: DeleteMission

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should create a new mission`() {
        val WKTreader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
        val polygon = WKTreader.read(multipolygonString) as MultiPolygon
        // Given
        val expectedNewMission = MissionEntity(
            id = 10,
            missionTypes = listOf(MissionTypeEnum.LAND),
            facade = "Outre-Mer",
            geom = polygon,
            observationsCnsp = null,
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isClosed = false,
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORFISH,
            hasMissionOrder = true,
            isUnderJdp = true,
            isGeometryComputedFromControls = false
        )
        val newMissionRequest = CreateOrUpdateMissionDataInput(
            missionTypes = listOf(MissionTypeEnum.LAND),
            observationsCnsp = null,
            facade = "Outre-Mer",
            geom = polygon,
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            missionSource = MissionSourceEnum.MONITORFISH,
            isClosed = false,
            hasMissionOrder = true,
            isUnderJdp = true,
            isGeometryComputedFromControls = false
        )
        val requestBody = objectMapper.writeValueAsString(newMissionRequest)
        given(createOrUpdateMission.execute(mission = any())).willReturn(expectedNewMission)
        // When
        mockMvc.perform(
            post("/api/v1/missions")
                .content(requestBody)
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }

    @Test
    fun `Should get all missions`() {
        // Given
        val WKTreader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
        val polygon = WKTreader.read(multipolygonString) as MultiPolygon

        val expectedFirstMission = MissionEntity(
            id = 10,
            missionTypes = listOf(MissionTypeEnum.SEA),
            facade = "Outre-Mer",
            geom = polygon,
            observationsCnsp = null,
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORFISH,
            isClosed = false,
            hasMissionOrder = false,
            isUnderJdp = false,
            isGeometryComputedFromControls = false
        )
        given(
            getMissions.execute(
                startedAfterDateTime = any(),
                startedBeforeDateTime = any(),
                missionSources = any(),
                missionTypes = any(),
                missionStatuses = any(),
                seaFronts = any(),
                pageNumber = any(),
                pageSize = any(),
            ),
        ).willReturn(listOf(expectedFirstMission))

        // When
        mockMvc.perform(get("/api/v1/missions"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }

    @Test
    fun `Should get specific mission when requested by Id`() {
        // Given
        val requestedId = 0
        val expectedFirstMission = MissionEntity(
            id = 10,
            missionTypes = listOf(MissionTypeEnum.SEA),
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORFISH,
            isClosed = false,
            hasMissionOrder = false,
            isUnderJdp = false,
            isGeometryComputedFromControls = false
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
        val expectedUpdatedMission = MissionEntity(
            id = 14,
            missionTypes = listOf(MissionTypeEnum.SEA),
            observationsCacem = "updated observations",
            observationsCnsp = "updated observations",
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            isClosed = false,
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORFISH,
            hasMissionOrder = true,
            isUnderJdp = true,
            isGeometryComputedFromControls = false
        )
        val envAction = EnvActionControlEntity(
            id = UUID.fromString("bf9f4062-83d3-4a85-b89b-76c0ded6473d"),
            actionTargetType = ActionTargetTypeEnum.VEHICLE,
            vehicleType = VehicleTypeEnum.VESSEL,
            actionNumberOfControls = 4,
        )
        val requestBody = CreateOrUpdateMissionDataInput(
            id = 14,
            missionTypes = listOf(MissionTypeEnum.SEA),
            observationsCacem = "updated observations",
            observationsCnsp = "updated observations",
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            missionSource = MissionSourceEnum.MONITORFISH,
            envActions = listOf(envAction),
            isClosed = false,
            hasMissionOrder = true,
            isUnderJdp = true,
            isGeometryComputedFromControls = false
        )
        given(createOrUpdateMission.execute(any())).willReturn(expectedUpdatedMission)
        // When
        mockMvc.perform(
            post("/api/v1/missions/14")
                .content(objectMapper.writeValueAsString(requestBody))
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.observationsCnsp", equalTo(expectedUpdatedMission.observationsCnsp)))
    }

    @Test
    fun `Should delete mission`() {
        // Given
        // When
        mockMvc.perform(delete("/api/v1/missions/20"))
            // Then
            .andExpect(status().isOk)
        Mockito.verify(deleteMission).execute(20)
    }
}
