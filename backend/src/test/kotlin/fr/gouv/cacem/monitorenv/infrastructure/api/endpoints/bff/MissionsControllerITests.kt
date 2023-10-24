package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.*
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.*
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.CreateOrUpdateMissionDataInput
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.geom.Point
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
@WebMvcTest(value = [(MissionsController::class)])
class MissionsControllerITests {

    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockBean
    private lateinit var createOrUpdateMission: CreateOrUpdateMission

    @MockBean
    private lateinit var getMonitorEnvMissions: GetMonitorEnvMissions

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
        val expectedNewMission = MissionDTO(
            mission = MissionEntity(
                id = 10,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = polygon,
                observationsCacem = null,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                isClosed = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            ),
        )
        val newMissionRequest = CreateOrUpdateMissionDataInput(
            missionTypes = listOf(MissionTypeEnum.LAND),
            observationsCacem = null,
            facade = "Outre-Mer",
            geom = polygon,
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            isClosed = false,
            missionSource = MissionSourceEnum.MONITORENV,
        )
        val requestbody = objectMapper.writeValueAsString(newMissionRequest)
        given(createOrUpdateMission.execute(newMissionRequest.toMissionEntity(), null)).willReturn(expectedNewMission)
        // When
        mockMvc.perform(
            put("/bff/v1/missions")
                .content(requestbody)
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

        val point = wktReader.read("POINT (-4.54877816747593 48.305559876971)") as Point

        val expectedFirstMission = MissionDTO(
            mission = MissionEntity(
                id = 10,
                missionTypes = listOf(MissionTypeEnum.SEA),
                controlUnits = listOf(
                    LegacyControlUnitEntity(
                        id = 1,
                        name = "CU1",
                        administration = "Admin 1",
                        resources = listOf(
                            LegacyControlUnitResourceEntity(
                                id = 2,
                                name = "Ressource 2",
                            ),
                        ),
                        isArchived = false,
                    ),
                ),
                openBy = "OpenBy",
                closedBy = "ClosedBy",
                facade = "Outre-Mer",
                geom = polygon,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                observationsCacem = "obs cacem",
                observationsCnsp = "obs cnsp",
                isClosed = false,
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            ),
            attachedReportingIds = listOf(1),
            attachedReportings = listOf(
                ReportingDTO(
                    reporting = ReportingEntity(
                        id = 1,
                        reportingId = 2300001,
                        sourceType = SourceTypeEnum.SEMAPHORE,
                        semaphoreId = 1,

                        targetType = TargetTypeEnum.VEHICLE,
                        vehicleType = VehicleTypeEnum.VEHICLE_LAND,
                        geom = polygon,
                        seaFront = "SeaFront",
                        description = "Description",
                        reportType = ReportingTypeEnum.INFRACTION_SUSPICION,
                        theme = "Theme",
                        subThemes = listOf("SubTheme"),
                        actionTaken = "ActionTaken",
                        isControlRequired = true,
                        hasNoUnitAvailable = true,
                        createdAt = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        validityTime = 4,
                        isArchived = false,
                        isDeleted = false,
                        openBy = "OpenBy",

                    ),
                    semaphore = SemaphoreEntity(
                        id = 1,
                        name = "Semaphore 1",
                        geom = point,
                        department = "29",
                        facade = "Outre-Mer",
                        administration = "Admin 1",
                        unit = "Unit 1",
                        email = "semaphore@",
                        phoneNumber = "0299999999",
                        base = "Base 1",
                    ),
                ),
            ),
        )
        given(
            getMonitorEnvMissions.execute(
                startedAfterDateTime = null,
                startedBeforeDateTime = null,
                seaFronts = null,
                missionSources = null,
                missionTypes = null,
                missionStatuses = null,
                pageNumber = null,
                pageSize = null,
            ),
        ).willReturn(listOf(expectedFirstMission))

        // When
        mockMvc.perform(get("/bff/v1/missions"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.length()", equalTo(1)))
            .andExpect(jsonPath("$[0].id", equalTo(10)))
            .andExpect(jsonPath("$[0].missionTypes[0]", equalTo(MissionTypeEnum.SEA.toString())))
            .andExpect(jsonPath("$[0].controlUnits[0].id", equalTo(1)))
            .andExpect(jsonPath("$[0].openBy", equalTo("OpenBy")))
            .andExpect(jsonPath("$[0].closedBy", equalTo("ClosedBy")))
            .andExpect(jsonPath("$[0].facade", equalTo("Outre-Mer")))
            .andExpect(jsonPath("$[0].geom.type", equalTo("MultiPolygon")))
            .andExpect(jsonPath("$[0].startDateTimeUtc", equalTo("2022-01-15T04:50:09Z")))
            .andExpect(jsonPath("$[0].endDateTimeUtc", equalTo("2022-01-23T20:29:03Z")))
            .andExpect(jsonPath("$[0].observationsCacem", equalTo("obs cacem")))
            .andExpect(jsonPath("$[0].observationsCnsp", equalTo("obs cnsp")))
            .andExpect(jsonPath("$[0].isClosed", equalTo(false)))
            .andExpect(jsonPath("$[0].isDeleted").doesNotExist())
            .andExpect(jsonPath("$[0].missionSource", equalTo(MissionSourceEnum.MONITORENV.toString())))
            .andExpect(jsonPath("$[0].hasMissionOrder", equalTo(false)))
            .andExpect(jsonPath("$[0].isUnderJdp", equalTo(false)))
            .andExpect(jsonPath("$[0].attachedReportingIds", equalTo(listOf(1))))
    }

    @Test
    fun `Should get specific mission when requested by Id`() {
        // Given
        val requestedId = 0
        val expectedFirstMission = MissionDTO(
            mission = MissionEntity(
                id = 10,
                missionTypes = listOf(MissionTypeEnum.SEA),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                isClosed = false,
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            ),
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
        val expectedUpdatedMission = MissionDTO(
            mission = MissionEntity(
                id = 14,
                missionTypes = listOf(MissionTypeEnum.SEA),
                observationsCacem = "updated observationsCacem",
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                isClosed = false,
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            ),
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
            observationsCacem = "updated observationsCacem",
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            envActions = listOf(envAction),
            missionSource = MissionSourceEnum.MONITORENV,
            isClosed = false,
        )
        given(createOrUpdateMission.execute(requestBody.toMissionEntity(), null)).willReturn(expectedUpdatedMission)
        // When
        mockMvc.perform(
            put("/bff/v1/missions/14")
                .content(objectMapper.writeValueAsString(requestBody))
                .contentType(MediaType.APPLICATION_JSON),
        )
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.observationsCacem", equalTo(expectedUpdatedMission.mission.observationsCacem)))
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
        mockMvc.perform(get("/bff/v1/missions/engaged_control_units"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].name", equalTo("Control Unit Name")))
    }
}
