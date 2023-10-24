package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.WebSecurityConfig
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.*
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.VesselSizeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.VesselTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.*
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.CreateOrUpdateMissionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.EnvActionAttachedToReportingIds
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.MissionEnvActionDataInput
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
    private lateinit var createOrUpdateMissionWithAttachedReporting: CreateOrUpdateMissionWithAttachedReporting

    @MockBean
    private lateinit var getFullMissions: GetFullMissions

    @MockBean
    private lateinit var getFullMissionById: GetFullMissionById

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
            attachedReportingIds = listOf(),
        )
        val requestbody = objectMapper.writeValueAsString(newMissionRequest)
        given(
            createOrUpdateMissionWithAttachedReporting.execute(
                mission = newMissionRequest.toMissionEntity(),
                attachedReportingIds = listOf(),
                envActionsAttachedToReportingIds = listOf(),
            ),
        ).willReturn(expectedNewMission)
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

        val controlEnvAction = EnvActionControlEntity(
            id = UUID.fromString("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b"),
            actionStartDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            actionEndDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            geom = point,
            facade = "Outre-Mer",
            department = "29",
            isAdministrativeControl = false,
            isComplianceWithWaterRegulationsControl = false,
            isSafetyEquipmentAndStandardsComplianceControl = false,
            isSeafarersControl = false,
            themes = listOf(ThemeEntity(theme = "Theme 1", subThemes = listOf("sous theme 1", "sous theme 2"))),
            observations = "Observations de l'action de contrôle",
            actionNumberOfControls = 2,
            actionTargetType = ActionTargetTypeEnum.VEHICLE,
            vehicleType = VehicleTypeEnum.VEHICLE_LAND,
            infractions = listOf(
                InfractionEntity(
                    id = "d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b",
                    natinf = listOf("27001"),
                    observations = "Observations de l'infraction",
                    registrationNumber = "AB-123-CD",
                    companyName = "Company Name",
                    relevantCourt = "LOCAL_COURT",
                    infractionType = InfractionTypeEnum.WAITING,
                    formalNotice = FormalNoticeEnum.NO,
                    toProcess = false,
                    controlledPersonIdentity = "Captain Flame",
                    vesselType = VesselTypeEnum.COMMERCIAL,
                    vesselSize = VesselSizeEnum.FROM_12_TO_24m,
                ),
            ),
        )

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
                envActions = listOf(controlEnvAction),
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
            getFullMissions.execute(
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
            .andExpect(jsonPath("$[0].envActions.length()", equalTo(1)))
            .andExpect(jsonPath("$[0].envActions[0].id", equalTo("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b")))
            .andExpect(jsonPath("$[0].envActions[0].actionType", equalTo("CONTROL")))
            .andExpect(jsonPath("$[0].envActions[0].actionStartDateTimeUtc", equalTo("2022-01-15T04:50:09Z")))
            .andExpect(jsonPath("$[0].envActions[0].actionEndDateTimeUtc", equalTo("2022-01-23T20:29:03Z")))
            .andExpect(jsonPath("$[0].envActions[0].geom.type", equalTo("Point")))
            .andExpect(jsonPath("$[0].envActions[0].facade", equalTo("Outre-Mer")))
            .andExpect(jsonPath("$[0].envActions[0].department", equalTo("29")))
            .andExpect(jsonPath("$[0].envActions[0].isAdministrativeControl", equalTo(false)))
            .andExpect(jsonPath("$[0].envActions[0].isComplianceWithWaterRegulationsControl", equalTo(false)))
            .andExpect(jsonPath("$[0].envActions[0].isSafetyEquipmentAndStandardsComplianceControl", equalTo(false)))
            .andExpect(jsonPath("$[0].envActions[0].isSeafarersControl", equalTo(false)))
            .andExpect(jsonPath("$[0].envActions[0].themes[0].theme", equalTo("Theme 1")))
            .andExpect(jsonPath("$[0].envActions[0].themes[0].subThemes[0]", equalTo("sous theme 1")))
            .andExpect(jsonPath("$[0].envActions[0].themes[0].subThemes[1]", equalTo("sous theme 2")))
            .andExpect(jsonPath("$[0].envActions[0].observations", equalTo("Observations de l'action de contrôle")))
            .andExpect(jsonPath("$[0].envActions[0].actionNumberOfControls", equalTo(2)))
            .andExpect(
                jsonPath("$[0].envActions[0].actionTargetType", equalTo(ActionTargetTypeEnum.VEHICLE.toString())),
            )
            .andExpect(jsonPath("$[0].envActions[0].vehicleType", equalTo(VehicleTypeEnum.VEHICLE_LAND.toString())))
            .andExpect(
                jsonPath("$[0].envActions[0].infractions[0].id", equalTo("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b")),
            )
            .andExpect(jsonPath("$[0].envActions[0].infractions[0].natinf[0]", equalTo("27001")))
            .andExpect(
                jsonPath("$[0].envActions[0].infractions[0].observations", equalTo("Observations de l'infraction")),
            )
            .andExpect(jsonPath("$[0].envActions[0].infractions[0].registrationNumber", equalTo("AB-123-CD")))
            .andExpect(jsonPath("$[0].envActions[0].infractions[0].companyName", equalTo("Company Name")))
            .andExpect(jsonPath("$[0].envActions[0].infractions[0].relevantCourt", equalTo("LOCAL_COURT")))
            .andExpect(
                jsonPath(
                    "$[0].envActions[0].infractions[0].infractionType",
                    equalTo(InfractionTypeEnum.WAITING.toString()),
                ),
            )
            .andExpect(
                jsonPath("$[0].envActions[0].infractions[0].formalNotice", equalTo(FormalNoticeEnum.NO.toString())),
            )
            .andExpect(jsonPath("$[0].envActions[0].infractions[0].toProcess", equalTo(false)))
            .andExpect(jsonPath("$[0].envActions[0].infractions[0].controlledPersonIdentity", equalTo("Captain Flame")))
            .andExpect(
                jsonPath("$[0].envActions[0].infractions[0].vesselType", equalTo(VesselTypeEnum.COMMERCIAL.toString())),
            )
            .andExpect(
                jsonPath(
                    "$[0].envActions[0].infractions[0].vesselSize",
                    equalTo(VesselSizeEnum.FROM_12_TO_24m.toString()),
                ),
            )
    }

    @Test
    fun `Should get specific mission when requested by Id`() {
        // Given
        val requestedId = 0

        val wktReader = WKTReader()
        val multipolygonString =
            "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        val point = wktReader.read("POINT (-4.54877816747593 48.305559876971)") as Point

        val controlEnvAction = EnvActionControlEntity(
            id = UUID.fromString("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b"),
            actionStartDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            actionEndDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
            geom = point,
            facade = "Outre-Mer",
            department = "29",
            isAdministrativeControl = false,
            isComplianceWithWaterRegulationsControl = false,
            isSafetyEquipmentAndStandardsComplianceControl = false,
            isSeafarersControl = false,
            themes = listOf(ThemeEntity(theme = "Theme 1", subThemes = listOf("sous theme 1", "sous theme 2"))),
            observations = "Observations de l'action de contrôle",
            actionNumberOfControls = 2,
            actionTargetType = ActionTargetTypeEnum.VEHICLE,
            vehicleType = VehicleTypeEnum.VEHICLE_LAND,
            infractions = listOf(
                InfractionEntity(
                    id = "d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b",
                    natinf = listOf("27001"),
                    observations = "Observations de l'infraction",
                    registrationNumber = "AB-123-CD",
                    companyName = "Company Name",
                    relevantCourt = "LOCAL_COURT",
                    infractionType = InfractionTypeEnum.WAITING,
                    formalNotice = FormalNoticeEnum.NO,
                    toProcess = false,
                    controlledPersonIdentity = "Captain Flame",
                    vesselType = VesselTypeEnum.COMMERCIAL,
                    vesselSize = VesselSizeEnum.FROM_12_TO_24m,
                ),
            ),
        )
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
                envActions = listOf(controlEnvAction),
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
        // we test only if the route is called with the right arg
        given(getFullMissionById.execute(requestedId)).willReturn(expectedFirstMission)

        // When
        mockMvc.perform(get("/bff/v1/missions/$requestedId"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.id", equalTo(10)))
            .andExpect(jsonPath("$.missionTypes[0]", equalTo(MissionTypeEnum.SEA.toString())))
            .andExpect(jsonPath("$.controlUnits[0].id", equalTo(1)))
            .andExpect(jsonPath("$.openBy", equalTo("OpenBy")))
            .andExpect(jsonPath("$.closedBy", equalTo("ClosedBy")))
            .andExpect(jsonPath("$.facade", equalTo("Outre-Mer")))
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon")))
            .andExpect(jsonPath("$.startDateTimeUtc", equalTo("2022-01-15T04:50:09Z")))
            .andExpect(jsonPath("$.endDateTimeUtc", equalTo("2022-01-23T20:29:03Z")))
            .andExpect(jsonPath("$.observationsCacem", equalTo("obs cacem")))
            .andExpect(jsonPath("$.observationsCnsp", equalTo("obs cnsp")))
            .andExpect(jsonPath("$.isClosed", equalTo(false)))
            .andExpect(jsonPath("$.isDeleted").doesNotExist())
            .andExpect(jsonPath("$.missionSource", equalTo(MissionSourceEnum.MONITORENV.toString())))
            .andExpect(jsonPath("$.hasMissionOrder", equalTo(false)))
            .andExpect(jsonPath("$.isUnderJdp", equalTo(false)))
            .andExpect(jsonPath("$.attachedReportingIds", equalTo(listOf(1))))
            .andExpect(jsonPath("$.envActions.length()", equalTo(1)))
            .andExpect(jsonPath("$.envActions[0].id", equalTo("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b")))
            .andExpect(jsonPath("$.envActions[0].actionType", equalTo("CONTROL")))
            .andExpect(jsonPath("$.envActions[0].actionStartDateTimeUtc", equalTo("2022-01-15T04:50:09Z")))
            .andExpect(jsonPath("$.envActions[0].actionEndDateTimeUtc", equalTo("2022-01-23T20:29:03Z")))
            .andExpect(jsonPath("$.envActions[0].geom.type", equalTo("Point")))
            .andExpect(jsonPath("$.envActions[0].facade", equalTo("Outre-Mer")))
            .andExpect(jsonPath("$.envActions[0].department", equalTo("29")))
            .andExpect(jsonPath("$.envActions[0].isAdministrativeControl", equalTo(false)))
            .andExpect(jsonPath("$.envActions[0].isComplianceWithWaterRegulationsControl", equalTo(false)))
            .andExpect(jsonPath("$.envActions[0].isSafetyEquipmentAndStandardsComplianceControl", equalTo(false)))
            .andExpect(jsonPath("$.envActions[0].isSeafarersControl", equalTo(false)))
            .andExpect(jsonPath("$.envActions[0].themes[0].theme", equalTo("Theme 1")))
            .andExpect(jsonPath("$.envActions[0].themes[0].subThemes[0]", equalTo("sous theme 1")))
            .andExpect(jsonPath("$.envActions[0].themes[0].subThemes[1]", equalTo("sous theme 2")))
            .andExpect(jsonPath("$.envActions[0].observations", equalTo("Observations de l'action de contrôle")))
            .andExpect(jsonPath("$.envActions[0].actionNumberOfControls", equalTo(2)))
            .andExpect(jsonPath("$.envActions[0].actionTargetType", equalTo(ActionTargetTypeEnum.VEHICLE.toString())))
            .andExpect(jsonPath("$.envActions[0].vehicleType", equalTo(VehicleTypeEnum.VEHICLE_LAND.toString())))
            .andExpect(jsonPath("$.envActions[0].infractions[0].id", equalTo("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b")))
            .andExpect(jsonPath("$.envActions[0].infractions[0].natinf[0]", equalTo("27001")))
            .andExpect(jsonPath("$.envActions[0].infractions[0].observations", equalTo("Observations de l'infraction")))
            .andExpect(jsonPath("$.envActions[0].infractions[0].registrationNumber", equalTo("AB-123-CD")))
            .andExpect(jsonPath("$.envActions[0].infractions[0].companyName", equalTo("Company Name")))
            .andExpect(jsonPath("$.envActions[0].infractions[0].relevantCourt", equalTo("LOCAL_COURT")))
            .andExpect(
                jsonPath(
                    "$.envActions[0].infractions[0].infractionType",
                    equalTo(InfractionTypeEnum.WAITING.toString()),
                ),
            )
            .andExpect(jsonPath("$.envActions[0].infractions[0].formalNotice", equalTo(FormalNoticeEnum.NO.toString())))
            .andExpect(jsonPath("$.envActions[0].infractions[0].toProcess", equalTo(false)))
            .andExpect(jsonPath("$.envActions[0].infractions[0].controlledPersonIdentity", equalTo("Captain Flame")))
            .andExpect(
                jsonPath("$.envActions[0].infractions[0].vesselType", equalTo(VesselTypeEnum.COMMERCIAL.toString())),
            )
            .andExpect(
                jsonPath(
                    "$.envActions[0].infractions[0].vesselSize",
                    equalTo(VesselSizeEnum.FROM_12_TO_24m.toString()),
                ),
            )

        verify(getFullMissionById).execute(requestedId)
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
        val envAction = MissionEnvActionDataInput(
            id = UUID.fromString("bf9f4062-83d3-4a85-b89b-76c0ded6473d"),
            actionType = ActionTypeEnum.CONTROL,
            actionStartDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            actionTargetType = ActionTargetTypeEnum.VEHICLE,
            vehicleType = VehicleTypeEnum.VESSEL,
            actionNumberOfControls = 4,
            reportingIds = listOf(1),
        )
        val requestBody = CreateOrUpdateMissionDataInput(
            id = 14,
            missionTypes = listOf(MissionTypeEnum.SEA),
            observationsCacem = "updated observationsCacem",
            startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
            envActions = listOf(envAction),
            missionSource = MissionSourceEnum.MONITORENV,
            isClosed = false,
            attachedReportingIds = listOf(1),
        )

        val envActionsAttachedToReportingIds = listOf(
            Pair(UUID.fromString("bf9f4062-83d3-4a85-b89b-76c0ded6473d"), listOf(1)),
        ) as List<EnvActionAttachedToReportingIds>
        given(
            createOrUpdateMissionWithAttachedReporting.execute(
                mission = requestBody.toMissionEntity(),
                attachedReportingIds = listOf(1),
                envActionsAttachedToReportingIds = envActionsAttachedToReportingIds,
            ),
        ).willReturn(expectedUpdatedMission)
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
