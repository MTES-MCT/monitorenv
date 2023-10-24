package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.publicapi

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.any
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.*
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.*
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
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
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime
import java.util.*

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

    @MockBean
    private lateinit var getEngagedControlUnits: GetEngagedControlUnits

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    @Test
    fun `Should create a new mission`() {
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
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
            isGeometryComputedFromControls = false,
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
    }

    @Test
    fun `Should get all missions`() {
        // Given
        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon

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
            isGeometryComputedFromControls = false,
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
            isGeometryComputedFromControls = false,
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
            isGeometryComputedFromControls = false,
        )
        given(
            createOrUpdateMission.execute(
                mission = requestBody.toMissionEntity(),
            ),
        ).willReturn(expectedUpdatedMission)
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

    @Test
    fun `Should get all engaged control units`() {
        // Given
        given(getEngagedControlUnits.execute()).willReturn(
            listOf(
                LegacyControlUnitEntity(
                    id = 123,
                    administration = "Admin",
                    resources = listOf(),
                    isArchived = false,
                    name = "Control Unit Name",
                ),
            ),
        )

        // When
        mockMvc.perform(get("/api/v1/missions/engaged_control_units"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].name", equalTo("Control Unit Name")))
    }
}
