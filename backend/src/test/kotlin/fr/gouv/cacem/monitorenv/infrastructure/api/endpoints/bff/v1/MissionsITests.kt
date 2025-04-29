package fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.config.SentryConfig
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.VesselTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CanDeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.CreateOrUpdateMissionWithActionsAndAttachedReporting
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.DeleteMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetEngagedControlUnits
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetFullMissionWithFishAndRapportNavActions
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.GetFullMissions
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionListDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.actions.EnvActionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.CreateOrUpdateMissionDataInput
import org.hamcrest.Matchers.equalTo
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.mockito.BDDMockito.given
import org.mockito.BDDMockito.verify
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.context.annotation.Import
import org.springframework.http.MediaType
import org.springframework.test.context.bean.override.mockito.MockitoBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put
import org.springframework.test.web.servlet.result.MockMvcResultHandlers
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.ZonedDateTime
import java.util.Optional
import java.util.UUID

@Import(SentryConfig::class, MapperConfiguration::class)
@AutoConfigureMockMvc(addFilters = false)
@WebMvcTest(value = [(Missions::class)])
class MissionsITests {
    @Autowired
    private lateinit var mockMvc: MockMvc

    @MockitoBean
    private lateinit var createOrUpdateMissionWithActionsAndAttachedReporting:
        CreateOrUpdateMissionWithActionsAndAttachedReporting

    @MockitoBean
    private lateinit var getFullMissions: GetFullMissions

    @MockitoBean
    private lateinit var getFullMissionWithFishAndRapportNavActions:
        GetFullMissionWithFishAndRapportNavActions

    @MockitoBean
    private lateinit var deleteMission: DeleteMission

    @MockitoBean
    private lateinit var canDeleteMission: CanDeleteMission

    @MockitoBean
    private lateinit var getEngagedControlUnits: GetEngagedControlUnits

    @Autowired
    private lateinit var objectMapper: ObjectMapper

    private val polygon =
        WKTReader()
            .read(
                "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))",
            ) as
            MultiPolygon
    private val point = WKTReader().read("POINT (-4.54877816747593 48.305559876971)") as Point

    @Test
    fun `Should create a new mission`() {
        // Given
        val expectedNewMission =
            MissionDetailsDTO(
                mission =
                    MissionEntity(
                        id = 10,
                        missionTypes = listOf(MissionTypeEnum.LAND),
                        facade = "Outre-Mer",
                        geom = polygon,
                        observationsCacem = null,
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        endDateTimeUtc =
                            ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                        createdAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                        updatedAtUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                        isDeleted = false,
                        missionSource = MissionSourceEnum.MONITORENV,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        isGeometryComputedFromControls = false,
                    ),
            )
        val newMissionRequest =
            CreateOrUpdateMissionDataInput(
                missionTypes = listOf(MissionTypeEnum.LAND),
                observationsCacem = null,
                facade = "Outre-Mer",
                geom = polygon,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                missionSource = MissionSourceEnum.MONITORENV,
                attachedReportingIds = listOf(),
                isGeometryComputedFromControls = false,
            )
        val requestbody = objectMapper.writeValueAsString(newMissionRequest)
        given(
            createOrUpdateMissionWithActionsAndAttachedReporting.execute(
                mission = newMissionRequest.toMissionEntity(),
                attachedReportingIds = listOf(),
                envActionsAttachedToReportingIds = listOf(),
            ),
        ).willReturn(Pair(true, expectedNewMission))
        // When
        mockMvc
            .perform(
                put("/bff/v1/missions")
                    .content(requestbody)
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.createdAtUtc", equalTo("2022-01-23T20:29:03Z")))
            .andExpect(jsonPath("$.updatedAtUtc", equalTo("2022-01-23T20:29:03Z")))
    }

    @Test
    fun `Should get mission and false in response when MonitorFish doesn't respond`() {
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
        given(getFullMissionWithFishAndRapportNavActions.execute(requestedId))
            .willReturn(
                Pair(
                    false,
                    expectedFirstMission,
                ),
            )

        // When
        mockMvc
            .perform(get("/bff/v1/missions/$requestedId"))
            // Then
            .andExpect(status().isPartialContent)
            .andExpect(jsonPath("$.missionTypes[0]", equalTo(MissionTypeEnum.SEA.toString())))
        verify(getFullMissionWithFishAndRapportNavActions).execute(requestedId)
    }

    @Test
    fun `Should get all missions`() {
        // Given
        val controlEnvAction =
            EnvActionControlEntity(
                id = UUID.fromString("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b"),
                actionStartDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                actionEndDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                completedBy = "DEF",
                completion = ActionCompletionEnum.TO_COMPLETE,
                controlPlans =
                    listOf(
                        EnvActionControlPlanEntity(
                            subThemeIds = listOf(1),
                            tagIds = listOf(1, 2),
                            themeId = 1,
                        ),
                    ),
                geom = point,
                facade = "Outre-Mer",
                department = "29",
                isAdministrativeControl = false,
                isComplianceWithWaterRegulationsControl = false,
                isSafetyEquipmentAndStandardsComplianceControl = false,
                isSeafarersControl = false,
                observations = "Observations de l'action de contrôle",
                openBy = "ABC",
                actionNumberOfControls = 2,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VEHICLE_LAND,
                infractions = TestUtils.getControlInfraction(),
                tags = listOf(),
                themes = listOf(),
            )

        val expectedFirstMission =
            MissionListDTO(
                mission =
                    MissionEntity(
                        id = 10,
                        missionTypes = listOf(MissionTypeEnum.SEA),
                        controlUnits =
                            listOf(
                                LegacyControlUnitEntity(
                                    id = 1,
                                    name = "CU1",
                                    administration = "Admin 1",
                                    resources =
                                        listOf(
                                            LegacyControlUnitResourceEntity(
                                                id = 2,
                                                controlUnitId =
                                                1,
                                                name =
                                                    "Ressource 2",
                                            ),
                                        ),
                                    isArchived = false,
                                ),
                            ),
                        openBy = "OpenBy",
                        completedBy = "CompletedBy",
                        facade = "Outre-Mer",
                        geom = polygon,
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        endDateTimeUtc =
                            ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                        observationsCacem = "obs cacem",
                        observationsCnsp = "obs cnsp",
                        isDeleted = false,
                        missionSource = MissionSourceEnum.MONITORENV,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        isGeometryComputedFromControls = false,
                        envActions = listOf(controlEnvAction),
                        createdAtUtc = null,
                        updatedAtUtc = null,
                    ),
                attachedReportingIds = listOf(1),
            )
        given(
            getFullMissions.execute(
                startedAfterDateTime = null,
                startedBeforeDateTime = null,
                seaFronts = null,
                missionTypes = null,
                missionStatuses = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            ),
        ).willReturn(listOf(expectedFirstMission))

        // When
        mockMvc
            .perform(get("/bff/v1/missions"))
            // Then
            .andExpect(status().isOk)
            .andDo(MockMvcResultHandlers.print())
            .andExpect(jsonPath("$.length()", equalTo(1)))
            .andExpect(jsonPath("$[0].id", equalTo(10)))
            .andExpect(
                jsonPath("$[0].missionTypes[0]", equalTo(MissionTypeEnum.SEA.toString())),
            ).andExpect(jsonPath("$[0].controlUnits[0].id", equalTo(1)))
            .andExpect(jsonPath("$[0].openBy", equalTo("OpenBy")))
            .andExpect(jsonPath("$[0].completedBy", equalTo("CompletedBy")))
            .andExpect(jsonPath("$[0].facade", equalTo("Outre-Mer")))
            .andExpect(jsonPath("$[0].geom.type", equalTo("MultiPolygon")))
            .andExpect(jsonPath("$[0].startDateTimeUtc", equalTo("2022-01-15T04:50:09Z")))
            .andExpect(jsonPath("$[0].endDateTimeUtc", equalTo("2022-01-23T20:29:03Z")))
            .andExpect(jsonPath("$[0].observationsCacem", equalTo("obs cacem")))
            .andExpect(jsonPath("$[0].observationsCnsp", equalTo("obs cnsp")))
            .andExpect(jsonPath("$[0].isDeleted").doesNotExist())
            .andExpect(jsonPath("$[0].hasMissionOrder", equalTo(false)))
            .andExpect(jsonPath("$[0].isUnderJdp", equalTo(false)))
            .andExpect(jsonPath("$[0].attachedReportingIds", equalTo(listOf(1))))
            .andExpect(jsonPath("$[0].envActions.length()", equalTo(1)))
            .andExpect(
                jsonPath(
                    "$[0].envActions[0].id",
                    equalTo("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b"),
                ),
            ).andExpect(jsonPath("$[0].envActions[0].actionType", equalTo("CONTROL")))
            .andExpect(
                jsonPath(
                    "$[0].envActions[0].actionStartDateTimeUtc",
                    equalTo("2022-01-15T04:50:09Z"),
                ),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].actionEndDateTimeUtc",
                    equalTo("2022-01-23T20:29:03Z"),
                ),
            ).andExpect(jsonPath("$[0].envActions[0].controlPlans[0].themeId", equalTo(1)))
            .andExpect(
                jsonPath("$[0].envActions[0].controlPlans[0].subThemeIds[0]", equalTo(1)),
            ).andExpect(jsonPath("$[0].envActions[0].controlPlans[0].tagIds[0]", equalTo(1)))
            .andExpect(jsonPath("$[0].envActions[0].controlPlans[0].tagIds[1]", equalTo(2)))
            .andExpect(jsonPath("$[0].envActions[0].geom.type", equalTo("Point")))
            .andExpect(jsonPath("$[0].envActions[0].facade", equalTo("Outre-Mer")))
            .andExpect(jsonPath("$[0].envActions[0].department", equalTo("29")))
            .andExpect(jsonPath("$[0].envActions[0].completedBy", equalTo("DEF")))
            .andExpect(jsonPath("$[0].envActions[0].openBy", equalTo("ABC")))
            .andExpect(jsonPath("$[0].envActions[0].isAdministrativeControl", equalTo(false)))
            .andExpect(
                jsonPath(
                    "$[0].envActions[0].isComplianceWithWaterRegulationsControl",
                    equalTo(false),
                ),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].isSafetyEquipmentAndStandardsComplianceControl",
                    equalTo(false),
                ),
            ).andExpect(jsonPath("$[0].envActions[0].isSeafarersControl", equalTo(false)))
            .andExpect(
                jsonPath(
                    "$[0].envActions[0].observations",
                    equalTo("Observations de l'action de contrôle"),
                ),
            ).andExpect(jsonPath("$[0].envActions[0].actionNumberOfControls", equalTo(2)))
            .andExpect(
                jsonPath(
                    "$[0].envActions[0].actionTargetType",
                    equalTo(ActionTargetTypeEnum.VEHICLE.toString()),
                ),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].vehicleType",
                    equalTo(VehicleTypeEnum.VEHICLE_LAND.toString()),
                ),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].infractions[0].id",
                    equalTo("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b"),
                ),
            ).andExpect(
                jsonPath("$[0].envActions[0].infractions[0].natinf[0]", equalTo("27001")),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].infractions[0].observations",
                    equalTo("Observations de l'infraction"),
                ),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].infractions[0].registrationNumber",
                    equalTo("AB-123-CD"),
                ),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].infractions[0].companyName",
                    equalTo("Company Name"),
                ),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].infractions[0].infractionType",
                    equalTo(InfractionTypeEnum.WAITING.toString()),
                ),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].infractions[0].formalNotice",
                    equalTo(FormalNoticeEnum.NO.toString()),
                ),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].infractions[0].controlledPersonIdentity",
                    equalTo("Captain Flame"),
                ),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].infractions[0].vesselType",
                    equalTo(VesselTypeEnum.COMMERCIAL.toString()),
                ),
            ).andExpect(
                jsonPath(
                    "$[0].envActions[0].infractions[0].vesselSize",
                    equalTo(23),
                ),
            )
    }

    @Test
    fun `Should get specific mission when requested by Id`() {
        // Given
        val requestedId = 0

        val controlEnvAction =
            EnvActionControlEntity(
                id = UUID.fromString("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b"),
                actionStartDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                actionEndDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                completedBy = "DEF",
                completion = ActionCompletionEnum.TO_COMPLETE,
                controlPlans =
                    listOf(
                        EnvActionControlPlanEntity(
                            subThemeIds = listOf(1),
                            tagIds = listOf(1, 2),
                            themeId = 1,
                        ),
                    ),
                geom = point,
                facade = "Outre-Mer",
                department = "29",
                isAdministrativeControl = false,
                isComplianceWithWaterRegulationsControl = false,
                isSafetyEquipmentAndStandardsComplianceControl = false,
                isSeafarersControl = false,
                observations = "Observations de l'action de contrôle",
                openBy = "ABC",
                actionNumberOfControls = 2,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VEHICLE_LAND,
                infractions = TestUtils.getControlInfraction(),
                tags = listOf(),
                themes = listOf(),
            )

        val expectedFirstMission =
            MissionDetailsDTO(
                mission =
                    MissionEntity(
                        id = 10,
                        missionTypes = listOf(MissionTypeEnum.SEA),
                        controlUnits =
                            listOf(
                                LegacyControlUnitEntity(
                                    id = 1,
                                    name = "CU1",
                                    administration = "Admin 1",
                                    resources =
                                        listOf(
                                            LegacyControlUnitResourceEntity(
                                                id = 2,
                                                controlUnitId =
                                                1,
                                                name =
                                                    "Ressource 2",
                                            ),
                                        ),
                                    isArchived = false,
                                ),
                            ),
                        openBy = "OpenBy",
                        completedBy = "CompletedBy",
                        facade = "Outre-Mer",
                        geom = polygon,
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        endDateTimeUtc =
                            ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                        observationsCacem = "obs cacem",
                        observationsCnsp = "obs cnsp",
                        isDeleted = false,
                        missionSource = MissionSourceEnum.MONITORENV,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        isGeometryComputedFromControls = false,
                        envActions = listOf(controlEnvAction),
                        createdAtUtc = null,
                        updatedAtUtc = null,
                    ),
                attachedReportingIds = listOf(1),
                attachedReportings =
                    listOf(
                        ReportingDetailsDTO(
                            reporting =
                                ReportingEntity(
                                    id = 1,
                                    reportingId = 2300001,
                                    reportingSources = listOf(),
                                    targetType = TargetTypeEnum.VEHICLE,
                                    vehicleType =
                                        VehicleTypeEnum
                                            .VEHICLE_LAND,
                                    geom = polygon,
                                    seaFront = "SeaFront",
                                    description = "Description",
                                    reportType =
                                        ReportingTypeEnum
                                            .INFRACTION_SUSPICION,
                                    actionTaken = "ActionTaken",
                                    isControlRequired = true,
                                    hasNoUnitAvailable = true,
                                    createdAt =
                                        ZonedDateTime.parse(
                                            "2022-01-15T04:50:09Z",
                                        ),
                                    validityTime = 4,
                                    isArchived = false,
                                    isDeleted = false,
                                    openBy = "OpenBy",
                                    isInfractionProven = true,
                                    tags = emptyList(),
                                    theme = aTheme(),
                                ),
                            reportingSources = listOf(),
                        ),
                    ),
            )

        // we test only if the route is called with the right arg
        given(getFullMissionWithFishAndRapportNavActions.execute(requestedId))
            .willReturn(
                Pair(
                    true,
                    expectedFirstMission,
                ),
            )

        // When
        mockMvc
            .perform(get("/bff/v1/missions/$requestedId"))
            // Then
            .andDo(MockMvcResultHandlers.print())
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.missionTypes[0]", equalTo(MissionTypeEnum.SEA.toString())))
            .andExpect(jsonPath("$.id", equalTo(10)))
            .andExpect(jsonPath("$.controlUnits[0].id", equalTo(1)))
            .andExpect(jsonPath("$.openBy", equalTo("OpenBy")))
            .andExpect(jsonPath("$.completedBy", equalTo("CompletedBy")))
            .andExpect(jsonPath("$.facade", equalTo("Outre-Mer")))
            .andExpect(jsonPath("$.geom.type", equalTo("MultiPolygon")))
            .andExpect(jsonPath("$.startDateTimeUtc", equalTo("2022-01-15T04:50:09Z")))
            .andExpect(jsonPath("$.endDateTimeUtc", equalTo("2022-01-23T20:29:03Z")))
            .andExpect(jsonPath("$.observationsCacem", equalTo("obs cacem")))
            .andExpect(jsonPath("$.observationsCnsp", equalTo("obs cnsp")))
            .andExpect(jsonPath("$.isDeleted").doesNotExist())
            .andExpect(
                jsonPath(
                    "$.missionSource",
                    equalTo(MissionSourceEnum.MONITORENV.toString()),
                ),
            ).andExpect(jsonPath("$.hasMissionOrder", equalTo(false)))
            .andExpect(jsonPath("$.isUnderJdp", equalTo(false)))
            .andExpect(jsonPath("$.attachedReportingIds", equalTo(listOf(1))))
            .andExpect(jsonPath("$.envActions.length()", equalTo(1)))
            .andExpect(
                jsonPath(
                    "$.envActions[0].id",
                    equalTo("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b"),
                ),
            ).andExpect(jsonPath("$.envActions[0].actionType", equalTo("CONTROL")))
            .andExpect(
                jsonPath(
                    "$.envActions[0].actionStartDateTimeUtc",
                    equalTo("2022-01-15T04:50:09Z"),
                ),
            ).andExpect(
                jsonPath(
                    "$.envActions[0].actionEndDateTimeUtc",
                    equalTo("2022-01-23T20:29:03Z"),
                ),
            ).andExpect(jsonPath("$.envActions[0].controlPlans[0].themeId", equalTo(1)))
            .andExpect(jsonPath("$.envActions[0].controlPlans[0].subThemeIds[0]", equalTo(1)))
            .andExpect(jsonPath("$.envActions[0].controlPlans[0].tagIds[0]", equalTo(1)))
            .andExpect(jsonPath("$.envActions[0].controlPlans[0].tagIds[1]", equalTo(2)))
            .andExpect(jsonPath("$.envActions[0].geom.type", equalTo("Point")))
            .andExpect(jsonPath("$.envActions[0].facade", equalTo("Outre-Mer")))
            .andExpect(jsonPath("$.envActions[0].department", equalTo("29")))
            .andExpect(jsonPath("$.envActions[0].completedBy", equalTo("DEF")))
            .andExpect(jsonPath("$.envActions[0].openBy", equalTo("ABC")))
            .andExpect(jsonPath("$.envActions[0].isAdministrativeControl", equalTo(false)))
            .andExpect(
                jsonPath(
                    "$.envActions[0].isComplianceWithWaterRegulationsControl",
                    equalTo(false),
                ),
            ).andExpect(
                jsonPath(
                    "$.envActions[0].isSafetyEquipmentAndStandardsComplianceControl",
                    equalTo(false),
                ),
            ).andExpect(jsonPath("$.envActions[0].isSeafarersControl", equalTo(false)))
            .andExpect(
                jsonPath(
                    "$.envActions[0].observations",
                    equalTo("Observations de l'action de contrôle"),
                ),
            ).andExpect(jsonPath("$.envActions[0].actionNumberOfControls", equalTo(2)))
            .andExpect(
                jsonPath(
                    "$.envActions[0].actionTargetType",
                    equalTo(ActionTargetTypeEnum.VEHICLE.toString()),
                ),
            ).andExpect(jsonPath("$.envActions[0].reportingIds.length()", equalTo(0)))
            .andExpect(
                jsonPath(
                    "$.envActions[0].vehicleType",
                    equalTo(VehicleTypeEnum.VEHICLE_LAND.toString()),
                ),
            ).andExpect(
                jsonPath(
                    "$.envActions[0].infractions[0].id",
                    equalTo("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b"),
                ),
            ).andExpect(jsonPath("$.envActions[0].infractions[0].natinf[0]", equalTo("27001")))
            .andExpect(
                jsonPath(
                    "$.envActions[0].infractions[0].observations",
                    equalTo("Observations de l'infraction"),
                ),
            ).andExpect(
                jsonPath(
                    "$.envActions[0].infractions[0].registrationNumber",
                    equalTo("AB-123-CD"),
                ),
            ).andExpect(
                jsonPath(
                    "$.envActions[0].infractions[0].companyName",
                    equalTo("Company Name"),
                ),
            ).andExpect(
                jsonPath(
                    "$.envActions[0].infractions[0].infractionType",
                    equalTo(InfractionTypeEnum.WAITING.toString()),
                ),
            ).andExpect(
                jsonPath(
                    "$.envActions[0].infractions[0].formalNotice",
                    equalTo(FormalNoticeEnum.NO.toString()),
                ),
            ).andExpect(
                jsonPath(
                    "$.envActions[0].infractions[0].controlledPersonIdentity",
                    equalTo("Captain Flame"),
                ),
            ).andExpect(
                jsonPath(
                    "$.envActions[0].infractions[0].vesselType",
                    equalTo(VesselTypeEnum.COMMERCIAL.toString()),
                ),
            ).andExpect(
                jsonPath(
                    "$.envActions[0].infractions[0].vesselSize",
                    equalTo(23),
                ),
            )

        verify(getFullMissionWithFishAndRapportNavActions).execute(requestedId)
    }

    @Test
    fun `update mission should return updated mission`() {
        // Given
        val expectedUpdatedMission =
            MissionDetailsDTO(
                mission =
                    MissionEntity(
                        id = 14,
                        missionTypes = listOf(MissionTypeEnum.SEA),
                        observationsCacem = "updated observationsCacem",
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        isDeleted = false,
                        missionSource = MissionSourceEnum.MONITORENV,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        isGeometryComputedFromControls = false,
                        createdAtUtc = null,
                        updatedAtUtc = null,
                    ),
            )
        val envAction =
            EnvActionDataInput(
                id = UUID.fromString("bf9f4062-83d3-4a85-b89b-76c0ded6473d"),
                actionType = ActionTypeEnum.CONTROL,
                actionStartDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                completion = ActionCompletionEnum.TO_COMPLETE,
                vehicleType = VehicleTypeEnum.VESSEL,
                awareness = null,
                actionNumberOfControls = 4,
                reportingIds = Optional.of(listOf(1)),
                tags = listOf(),
                themes = listOf(),
            )

        val requestBody =
            CreateOrUpdateMissionDataInput(
                id = 14,
                missionTypes = listOf(MissionTypeEnum.SEA),
                observationsCacem = "updated observationsCacem",
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                envActions = listOf(envAction),
                missionSource = MissionSourceEnum.MONITORENV,
                attachedReportingIds = listOf(1),
                isGeometryComputedFromControls = false,
            )
        val envActionsAttachedToReportingIds =
            listOf(
                Pair(UUID.fromString("bf9f4062-83d3-4a85-b89b-76c0ded6473d"), listOf(1)),
            )
        given(
            createOrUpdateMissionWithActionsAndAttachedReporting.execute(
                mission = requestBody.toMissionEntity(),
                attachedReportingIds = listOf(1),
                envActionsAttachedToReportingIds = envActionsAttachedToReportingIds,
            ),
        ).willReturn(Pair(true, expectedUpdatedMission))
        // When
        mockMvc
            .perform(
                put("/bff/v1/missions/14")
                    .content(objectMapper.writeValueAsString(requestBody))
                    .contentType(MediaType.APPLICATION_JSON),
            )
            // Then
            .andExpect(status().isOk)
            .andExpect(
                jsonPath(
                    "$.observationsCacem",
                    equalTo(expectedUpdatedMission.mission.observationsCacem),
                ),
            )
    }

    @Test
    fun `Should delete mission`() {
        val source = MissionSourceEnum.MONITORENV
        val missionId = 20
        mockMvc
            .perform(delete("/bff/v1/missions/$missionId"))
            // Then
            .andExpect(status().isOk)
        verify(deleteMission).execute(missionId, source)
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
            .perform(get("/bff/v1/missions/engaged_control_units"))
            // Then
            .andExpect(status().isOk)
            .andExpect(jsonPath("$[0].controlUnit.name", equalTo("Control Unit Name")))
            .andExpect(jsonPath("$[0].missionSources[0]", equalTo("MONITORFISH")))
    }
}
