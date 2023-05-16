package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.*
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs.CreateOrUpdateMissionDataInput
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.springframework.context.annotation.Import
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.verify
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import java.time.ZonedDateTime
import java.util.*

@Import(WebSecurityConfig::class, MapperConfiguration::class)
@WebMvcTest(value = [(MissionsController::class)])
class MissionsControllerITests {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var createMission: CreateMission

    @MockBean
    private lateinit var getMonitorEnvMissions: GetMonitorEnvMissions

    @MockBean
    private lateinit var getMissionById: GetMissionById

    @MockBean
    private lateinit var updateMission: UpdateMission

    @MockBean
    private lateinit var deleteMission: DeleteMission

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should create a new mission`() {
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        // Given
        val expectedNewMission = MissionEntity(
            id = 10,
            missionTypes = listOf( MissionTypeEnum.LAND),
            facade = "Outre-Mer",
            geom = polygon,
            observationsCacem = null,
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isDeleted = false,
            isClosed = false,
            missionSource = MissionSourceEnum.MONITORENV,
            hasMissionOrder = false,
            isUnderJdp = false
        )
        val newMissionRequest = CreateOrUpdateMissionDataInput(
            missionTypes = listOf( MissionTypeEnum.LAND),
            observationsCacem = null,
            facade = "Outre-Mer",
            geom = polygon,
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isClosed = false,
            missionSource = MissionSourceEnum.MONITORENV
        )
        val requestbody = objectMapper.writeValueAsString(newMissionRequest)
        given(this.createMission.execute(mission = any())).willReturn(expectedNewMission)
        // When
        mockMvc.perform(
            put("/bff/v1/missions")
                .content(requestbody)
                .contentType(MediaType.APPLICATION_JSON)
        )
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
    }

    @Test
    fun `Should get all missions`() {
        // Given
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877816747593 48.305559876971, -4.54997332394943 48.3059760121399, -4.54998501370013 48.3071882334181, -4.54879290083417 48.3067746138142, -4.54877816747593 48.305559876971)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

        val expectedFirstMission = MissionEntity(
            id = 10,
            missionTypes = listOf( MissionTypeEnum.SEA),
            facade = "Outre-Mer",
            geom = polygon,
            observationsCacem = null,
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isClosed = false,
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORENV,
            hasMissionOrder = false,
            isUnderJdp = false
        )
        given(
            this.getMonitorEnvMissions.execute(
                startedAfterDateTime = any(),
                startedBeforeDateTime = any(),
                seaFronts = any(),
                missionSources = any(),
                missionTypes = any(),
                missionStatuses = any(),
                pageNumber = any(),
                pageSize = any()
            )
        ).willReturn(listOf(expectedFirstMission))

        // When
        mockMvc.perform(get("/bff/v1/missions"))
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
            missionTypes = listOf( MissionTypeEnum.SEA),
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            isClosed = false,
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORENV,
            hasMissionOrder = false,
            isUnderJdp = false
        )
        // we test only if the route is called with the right arg
        given(getMissionById.execute(requestedId)).willReturn(expectedFirstMission)

        // When
        mockMvc.perform(get("/bff/v1/missions/$requestedId"))
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
            missionTypes = listOf( MissionTypeEnum.SEA),
            observationsCacem = "updated observationsCacem",
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            isClosed = false,
            isDeleted = false,
            missionSource = MissionSourceEnum.MONITORENV,
            hasMissionOrder = false,
            isUnderJdp = false
        )
        val envAction = EnvActionControlEntity(
            id = UUID.fromString("bf9f4062-83d3-4a85-b89b-76c0ded6473d"),
            actionTargetType = ActionTargetTypeEnum.VEHICLE,
            vehicleType = VehicleTypeEnum.VESSEL,
            actionNumberOfControls = 4
        )
        val requestBody = CreateOrUpdateMissionDataInput(
            id = 14,
            missionTypes = listOf( MissionTypeEnum.SEA),
            observationsCacem = "updated observationsCacem",
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            envActions = listOf(envAction),
            missionSource = MissionSourceEnum.MONITORENV,
            isClosed = false
        )
        given(this.updateMission.execute(any())).willReturn(expectedUpdatedMission)
        // When
        mockMvc.perform(
            put("/bff/v1/missions/14")
                .content(objectMapper.writeValueAsString(requestBody))
                .contentType(MediaType.APPLICATION_JSON)
        )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.observationsCacem", equalTo(expectedUpdatedMission.observationsCacem)))
    }

    @Test
    fun `Should delete mission`() {
        // Given
        // When
        mockMvc.perform(delete("/bff/v1/missions/20"))
            // Then
            .andExpect(status().isOk)
        Mockito.verify(deleteMission).execute(20)
    }
}
