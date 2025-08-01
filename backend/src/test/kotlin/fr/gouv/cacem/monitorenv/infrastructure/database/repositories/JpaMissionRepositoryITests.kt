package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.config.CustomQueryCountListener
import fr.gouv.cacem.monitorenv.config.DataSourceProxyBeanPostProcessor
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.VesselTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.AdministrativeResponseEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.SeizureTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.tags.fixtures.TagFixture.Companion.aTag
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.catchThrowable
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Import
import org.springframework.orm.jpa.JpaObjectRetrievalFailureException
import org.springframework.test.context.junit.jupiter.SpringExtension
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.util.UUID

@ExtendWith(SpringExtension::class)
@Import(DataSourceProxyBeanPostProcessor::class)
class JpaMissionRepositoryITests : AbstractDBTests() {
    @Autowired
    private val customQueryCountListener: CustomQueryCountListener? = null

    @Autowired
    private lateinit var jpaMissionRepository: JpaMissionRepository

    @Autowired
    private lateinit var jpaControlUnitRepository: JpaControlUnitRepository

    @Autowired
    private lateinit var jpaControlUnitResourceRepository: JpaControlUnitResourceRepository

    @BeforeEach
    fun setUp() {
        customQueryCountListener!!.resetQueryCount() // Reset the count before each test
    }

    private val polygon =
        WKTReader()
            .read(
                "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))",
            ) as
            MultiPolygon
    private val point = WKTReader().read("POINT (-4.54877816747593 48.305559876971)") as Point

    @Test
    @Transactional
    fun `findAll Should return all missions when only required startedAfter is set to a very old date`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2022-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                missionStatuses = null,
                seaFronts = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
        assertThat(missions).hasSize(54)
    }

    @Test
    @Transactional
    fun `findAll Should return missions when filtered by controlUnit`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                controlUnitIds = listOf(10002, 10018),
                startedAfter = ZonedDateTime.parse("2022-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                missionStatuses = null,
                seaFronts = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
        assertThat(missions).hasSize(26)
    }

    @Test
    @Transactional
    fun `delete Should set the deleted flag as true`() {
        // Given
        val missionsList =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2022-08-08T00:00:00Z").toInstant(),
                missionTypes = null,
                missionStatuses = null,
                seaFronts = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        assertThat(missionsList).hasSize(21)

        // When
        customQueryCountListener!!.resetQueryCount()
        jpaMissionRepository.delete(3)

        // Then
        customQueryCountListener.resetQueryCount()
        val nextMissionList =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2022-08-08T00:00:00Z").toInstant(),
                missionTypes = null,
                missionStatuses = null,
                seaFronts = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        assertThat(nextMissionList).hasSize(20)
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when startedAfter & startedBefore are set`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2022-08-08T00:00:00Z").toInstant(),
                missionTypes = null,
                missionStatuses = null,
                seaFronts = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        assertThat(missions).hasSize(21)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when missionTypes is set`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = listOf(MissionTypeEnum.SEA),
                missionStatuses = null,
                seaFronts = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        println(missions)
        assertThat(missions).hasSize(22)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when multiple missionTypes are set`() {
        // When

        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = listOf(MissionTypeEnum.SEA, MissionTypeEnum.LAND),
                missionStatuses = null,
                seaFronts = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        // Then
        // MissionTypes are hardcoded in query. If you add a new mission type, you need to update
        // the query
        assertThat(MissionTypeEnum.entries.size).isEqualTo(3)
        assertThat(MissionTypeEnum.SEA.name).isEqualTo("SEA")
        assertThat(MissionTypeEnum.LAND.name).isEqualTo("LAND")
        assertThat(MissionTypeEnum.AIR.name).isEqualTo("AIR")
        assertThat(missions).hasSize(45)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when seaFront is set to MEMN`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                missionStatuses = null,
                seaFronts = listOf("MEMN"),
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        // Then
        assertThat(missions).hasSize(9)
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when seaFront is set to MEMN and NAMO`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                missionStatuses = null,
                seaFronts = listOf("MEMN", "NAMO"),
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        assertThat(missions).hasSize(27)
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when status is set to UPCOMING`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                seaFronts = null,
                missionStatuses = listOf("UPCOMING"),
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        assertThat(missions).hasSize(10)
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when status is set to PENDING`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                seaFronts = null,
                missionStatuses = listOf("PENDING"),
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        assertThat(missions).hasSize(14)
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when status is set to ENDED`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                seaFronts = null,
                missionStatuses = listOf("ENDED"),
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )
        assertThat(missions).hasSize(30)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when search query is John Doe`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                seaFronts = null,
                missionStatuses = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = "John doe",
            )
        assertThat(missions).hasSize(1)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when search query is start with BAL`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                seaFronts = null,
                missionStatuses = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = "BAL",
            )
        assertThat(missions).hasSize(1)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when search query is an id`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                seaFronts = null,
                missionStatuses = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = "53",
            )
        assertThat(missions).hasSize(1)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findAll with pagenumber and pagesize Should return subset of missions`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                missionStatuses = null,
                seaFronts = null,
                pageNumber = 1,
                pageSize = 10,
                searchQuery = null,
            )
        assertThat(missions).hasSize(10)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findByControlUnitId should find the matching missions`() {
        val foundMissions = jpaMissionRepository.findByControlUnitId(10002)

        assertThat(foundMissions).hasSize(16)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findByControlUnitResourceId should find the matching missions`() {
        val foundMissions = jpaMissionRepository.findByControlUnitResourceId(8)

        assertThat(foundMissions).hasSize(4)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findById Should return specified mission`() {
        // When
        val firstMission =
            MissionDetailsDTO(
                mission =
                    MissionEntity(
                        id = 10,
                        missionTypes = listOf(MissionTypeEnum.LAND),
                        openBy = "KIM",
                        completedBy = "TRA",
                        facade = "NAMO",
                        observationsCacem =
                            "Remain vote several ok. Bring American play woman challenge. Throw low law positive seven.",
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-03-21T12:11:13Z"),
                        endDateTimeUtc = null,
                        geom = polygon,
                        isDeleted = false,
                        envActions = listOf(),
                        missionSource = MissionSourceEnum.MONITORENV,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        controlUnits =
                            listOf(
                                LegacyControlUnitEntity(
                                    id = 10002,
                                    administration = "DDTM",
                                    isArchived = false,
                                    name = "DML 2A",
                                    resources =
                                        listOf(
                                            LegacyControlUnitResourceEntity(
                                                id = 3,
                                                controlUnitId =
                                                10002,
                                                name =
                                                    "Semi-rigide 1",
                                            ),
                                            LegacyControlUnitResourceEntity(
                                                id = 4,
                                                controlUnitId =
                                                10002,
                                                name =
                                                    "Semi-rigide 2",
                                            ),
                                            LegacyControlUnitResourceEntity(
                                                id = 5,
                                                controlUnitId =
                                                10002,
                                                name =
                                                    "Voiture",
                                            ),
                                        ),
                                ),
                            ),
                        isGeometryComputedFromControls = false,
                        createdAtUtc = null,
                        updatedAtUtc = null,
                    ),
            )
        val mission = jpaMissionRepository.findFullMissionById(10)

        assertThat(
            mission?.copy(
                mission =
                    mission.mission.copy(
                        createdAtUtc = null,
                        updatedAtUtc = null,
                    ),
            ),
        ).isEqualTo(firstMission)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findById Should return specified mission and associated env actions and associated envActionReportingIds`() {
        // When
        val missionDTO = jpaMissionRepository.findFullMissionById(34)
        assertThat(missionDTO).isNotNull()
        assertThat(missionDTO!!.mission.id).isEqualTo(34)
        assertThat(missionDTO.mission.envActions).hasSize(2)
        assertThat(
            missionDTO.envActionsAttachedToReportingIds?.get(0)?.first,
        ).isEqualTo(UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807"))
        assertThat(missionDTO.envActionsAttachedToReportingIds?.get(0)?.second).isEqualTo(listOf(6))

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `findByIds() should find the matching missions`() {
        val foundMissions = jpaMissionRepository.findByIds(listOf(50, 51, 52))

        assertThat(foundMissions).hasSize(3)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    @Transactional
    fun `save should create a new mission`() {
        // Given
        val existingMissions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2022-08-08T00:00:00Z").toInstant(),
                missionTypes = null,
                missionStatuses = null,
                seaFronts = null,
                pageNumber = null,
                pageSize = null,
                searchQuery = null,
            )

        assertThat(existingMissions).hasSize(21)

        val noteObservations = "Quelqu'un aurait vu quelque chose quelque part à un certain moment."
        val noteObservationsByUnit =
            "Une unité aurait vu quelque chose quelque part à un certain moment."

        val tags =
            listOf(
                aTag(
                    id = 1,
                    name = "PN",
                    startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                    endedAt = ZonedDateTime.parse("2030-12-31T00:00Z"),
                ),
            )
        val themes =
            listOf(
                aTheme(
                    id = 2,
                    name = "AMP sans réglementation particulière",
                    startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                    endedAt = ZonedDateTime.parse("2099-12-31T23:59:59Z"),
                ),
            )
        val newMission =
            MissionEntity(
                missionTypes = listOf(MissionTypeEnum.SEA),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                envActions =
                    listOf(
                        EnvActionControlEntity(
                            id =
                                UUID.fromString(
                                    "33310163-4e22-4d3d-b585-dac4431eb4b5",
                                ),
                            facade = "Facade 1",
                            completion = ActionCompletionEnum.TO_COMPLETE,
                            controlPlans =
                                listOf(
                                    EnvActionControlPlanEntity(
                                        subThemeIds = listOf(1),
                                        tagIds = listOf(1, 2),
                                        themeId = 1,
                                    ),
                                ),
                            department = "Department 1",
                            geom = point,
                            vehicleType = VehicleTypeEnum.VEHICLE_LAND,
                            isAdministrativeControl = true,
                            isComplianceWithWaterRegulationsControl = true,
                            isSafetyEquipmentAndStandardsComplianceControl =
                            true,
                            isSeafarersControl = true,
                            tags = tags,
                            themes = themes,
                        ),
                        EnvActionSurveillanceEntity(
                            id =
                                UUID.fromString(
                                    "a6c4bd17-eb45-4504-ab15-7a18ea714a10",
                                ),
                            completion = ActionCompletionEnum.TO_COMPLETE,
                            facade = "Facade 2",
                            department = "Department 2",
                            awareness = null,
                            geom = polygon,
                            tags = tags,
                            themes = themes,
                        ),
                        EnvActionNoteEntity(
                            id =
                                UUID.fromString(
                                    "126ded89-2dc0-4c77-9bf2-49f86b9a71a1",
                                ),
                            observations = noteObservations,
                        ),
                    ),
                controlUnits =
                    listOf(
                        LegacyControlUnitEntity(
                            id = 10121,
                            name = "PAM Jeanne Barret",
                            administration = "DIRM / DM",
                            isArchived = false,
                            resources =
                                listOf(
                                    LegacyControlUnitResourceEntity(
                                        id = 8,
                                        controlUnitId = 10121,
                                        name = "PAM Jeanne Barret",
                                    ),
                                ),
                        ),
                    ),
                isGeometryComputedFromControls = false,
                observationsByUnit = noteObservationsByUnit,
                createdAtUtc = null,
                updatedAtUtc = null,
            )

        // When
        val newMissionCreated = jpaMissionRepository.save(newMission)

        // Then
        assertThat(newMissionCreated.mission.createdAtUtc)
            .isAfter(ZonedDateTime.now().minusMinutes(1))
        assertThat(newMissionCreated.mission.updatedAtUtc)
            .isAfter(ZonedDateTime.now().minusMinutes(1))
        assertThat(newMissionCreated.mission.controlUnits).hasSize(1)
        assertThat(
            newMissionCreated.mission.controlUnits
                .first()
                .id,
        ).isEqualTo(10121)
        assertThat(
            newMissionCreated.mission.controlUnits
                .first()
                .name,
        ).isEqualTo("PAM Jeanne Barret")
        assertThat(
            newMissionCreated.mission.controlUnits
                .first()
                .administration,
        ).isEqualTo("DIRM / DM")
        assertThat(
            newMissionCreated.mission.controlUnits
                .first()
                .resources,
        ).hasSize(1)
        assertThat(
            newMissionCreated.mission.controlUnits
                .first()
                .resources
                .first()
                .id,
        ).isEqualTo(8)
        assertThat(
            newMissionCreated.mission.controlUnits
                .first()
                .resources
                .first()
                .controlUnitId,
        ).isEqualTo(10121)
        assertThat(
            newMissionCreated.mission.controlUnits
                .first()
                .resources
                .first()
                .name,
        ).isEqualTo("PAM Jeanne Barret")
        assertThat(newMissionCreated.mission.envActions).hasSize(3)
        assertThat(
            newMissionCreated.mission.envActions
                ?.first()
                ?.facade,
        ).isEqualTo("Facade 1")
        assertThat(
            newMissionCreated.mission.envActions
                ?.first()
                ?.department,
        ).isEqualTo("Department 1")
        assertThat(
            newMissionCreated.mission.envActions
                ?.get(1)
                ?.facade,
        ).isEqualTo("Facade 2")
        assertThat(
            newMissionCreated.mission.envActions
                ?.get(1)
                ?.department,
        ).isEqualTo("Department 2")
        assertThat((newMissionCreated.mission.envActions?.get(2) as EnvActionNoteEntity).observations).isEqualTo(
            noteObservations,
        )
        assertThat(newMissionCreated.mission.observationsByUnit).isEqualTo(noteObservationsByUnit)
        newMissionCreated.mission.envActions.forEach { action ->
            when (action) {
                is EnvActionControlEntity -> {
                    assertThat(action.themes).usingRecursiveComparison().isEqualTo(themes)
                    assertThat(action.tags).usingRecursiveComparison().isEqualTo(tags)
                }

                is EnvActionSurveillanceEntity -> {
                    assertThat(action.themes).usingRecursiveComparison().isEqualTo(themes)
                    assertThat(action.tags).usingRecursiveComparison().isEqualTo(tags)
                }
            }
        }

        assertThat(jpaMissionRepository.findById(newMissionCreated.mission.id!!))
            .usingRecursiveComparison()
            .isEqualTo(newMissionCreated.mission)
    }

    @Test
    @Transactional
    fun `save should update mission resources`() {
        // Given
        val newMission =
            MissionEntity(
                missionTypes = listOf(MissionTypeEnum.SEA),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                controlUnits =
                    listOf(
                        LegacyControlUnitEntity(
                            id = 10004,
                            name = "DPM – DDTM 35",
                            administration = "DDTM",
                            isArchived = false,
                            resources =
                                listOf(
                                    LegacyControlUnitResourceEntity(
                                        id = 8,
                                        controlUnitId = 10004,
                                        name = "PAM Jeanne Barret",
                                    ),
                                ),
                        ),
                    ),
                isGeometryComputedFromControls = false,
                createdAtUtc = null,
                updatedAtUtc = null,
            )
        val createdMission = jpaMissionRepository.save(newMission)

        // When
        val updatedMission =
            jpaMissionRepository.save(
                createdMission.mission.copy(
                    controlUnits =
                        listOf(
                            LegacyControlUnitEntity(
                                id = 10002,
                                name = "DML 2A",
                                administration = "DDTM",
                                isArchived = false,
                                resources =
                                    listOf(
                                        LegacyControlUnitResourceEntity(
                                            id = 3,
                                            controlUnitId =
                                            10002,
                                            name =
                                                "Semi-rigide 1",
                                        ),
                                        LegacyControlUnitResourceEntity(
                                            id = 5,
                                            controlUnitId =
                                            10002,
                                            name = "Voiture",
                                        ),
                                    ),
                            ),
                        ),
                ),
            )

        // Then
        assertThat(updatedMission.mission.controlUnits).hasSize(1)
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .id,
        ).isEqualTo(10002)
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .name,
        ).isEqualTo("DML 2A")
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .administration,
        ).isEqualTo("DDTM")
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .resources,
        ).hasSize(2)
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .resources
                .first()
                .id,
        ).isEqualTo(3)
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .resources
                .first()
                .controlUnitId,
        ).isEqualTo(10002)
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .resources
                .first()
                .name,
        ).isEqualTo("Semi-rigide 1")
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .resources
                .last()
                .id,
        ).isEqualTo(5)
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .resources
                .last()
                .controlUnitId,
        ).isEqualTo(10002)
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .resources
                .last()
                .name,
        ).isEqualTo("Voiture")
    }

    @Test
    @Transactional
    fun `save should update existing mission with existing resources`() {
        // Given
        val mission = jpaMissionRepository.findById(25)
        val newControlUnitResource = jpaControlUnitResourceRepository.findById(10)!!
        val newControlUnit =
            jpaControlUnitRepository.findFullControlUnitById(
                requireNotNull(newControlUnitResource.controlUnit.id),
            )!!

        val nextMission =
            mission?.copy(
                controlUnits =
                    mission.controlUnits.plus(
                        LegacyControlUnitEntity(
                            id = requireNotNull(newControlUnit.controlUnit.id),
                            administration = newControlUnit.administration.name,
                            isArchived = newControlUnit.controlUnit.isArchived,
                            name = newControlUnit.controlUnit.name,
                            resources =
                                listOf(
                                    newControlUnitResource
                                        .toLegacyControlUnitResource(),
                                ),
                            contact = null,
                        ),
                    ),
            )

        val updatedMission = jpaMissionRepository.save(nextMission!!)

        assertThat(updatedMission.mission.createdAtUtc).isNotNull()
        assertThat(updatedMission.mission.updatedAtUtc).isAfter(ZonedDateTime.now().minusMinutes(1))
        assertThat(updatedMission.mission.controlUnits).hasSize(2)
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .id,
        ).isEqualTo(10002)
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .resources,
        ).hasSize(1)
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .resources
                .first()
                .id,
        ).isEqualTo(3)
        assertThat(
            updatedMission.mission.controlUnits
                .first()
                .resources
                .first()
                .controlUnitId,
        ).isEqualTo(10002)
        assertThat(
            updatedMission.mission.controlUnits
                .last()
                .id,
        ).isEqualTo(10018)
        assertThat(
            updatedMission.mission.controlUnits
                .last()
                .resources,
        ).hasSize(1)
        assertThat(
            updatedMission.mission.controlUnits
                .last()
                .resources
                .first()
                .id,
        ).isEqualTo(10)
        assertThat(
            updatedMission.mission.controlUnits
                .last()
                .resources
                .first()
                .controlUnitId,
        ).isEqualTo(10018)
    }

    @Test
    @Transactional
    fun `save should throw an exception When the resource id is not found`() {
        // Given
        val newMission =
            MissionEntity(
                missionTypes = listOf(MissionTypeEnum.SEA),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                controlUnits =
                    listOf(
                        LegacyControlUnitEntity(
                            id = 10004,
                            name = "DPM – DDTM 35",
                            administration = "DDTM",
                            isArchived = false,
                            resources =
                                listOf(
                                    LegacyControlUnitResourceEntity(
                                        id = 123456,
                                        controlUnitId = 5,
                                        name = "PAM Jeanne Barret",
                                    ),
                                ),
                        ),
                    ),
                isGeometryComputedFromControls = false,
                createdAtUtc = null,
                updatedAtUtc = null,
            )

        // When
        val throwable = catchThrowable { jpaMissionRepository.save(newMission) }

        // Then
        assertThat(throwable).isInstanceOf(JpaObjectRetrievalFailureException::class.java)
    }

    @Test
    fun `save should throw an exception When the unit id is not found`() {
        // Given
        val newMission =
            MissionEntity(
                missionTypes = listOf(MissionTypeEnum.SEA),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                controlUnits =
                    listOf(
                        LegacyControlUnitEntity(
                            id = 123456,
                            name = "PAM Jeanne Barret",
                            administration = "",
                            isArchived = false,
                            resources = listOf(),
                        ),
                    ),
                isGeometryComputedFromControls = false,
                createdAtUtc = null,
                updatedAtUtc = null,
            )

        // When
        val throwable = catchThrowable { jpaMissionRepository.save(newMission) }

        // Then
        assertThat(throwable).isInstanceOf(JpaObjectRetrievalFailureException::class.java)
    }

    @Test
    @Transactional
    fun `save Should update mission`() {
        val id = 10
        // Given
        val tags =
            listOf(
                aTag(
                    id = 1,
                    name = "PN",
                    startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                    endedAt = ZonedDateTime.parse("2030-12-31T00:00Z"),
                ),
            )
        val themes =
            listOf(
                aTheme(
                    id = 2,
                    name = "AMP sans réglementation particulière",
                    startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                    endedAt = ZonedDateTime.parse("2099-12-31T23:59:59Z"),
                ),
            )
        val infraction =
            InfractionEntity(
                id = "a4d8cd64-ee6e-4dba-ae5d-f6a41395b52a",
                administrativeResponse = AdministrativeResponseEnum.SANCTION,
                natinf = listOf("53432"),
                observations = "This is an infraction",
                registrationNumber = "REGISTRATION NUM",
                companyName = "ACME inc.",
                infractionType = InfractionTypeEnum.WITHOUT_REPORT,
                formalNotice = FormalNoticeEnum.NO,
                controlledPersonIdentity = "Dick Hoover",
                vesselType = VesselTypeEnum.FISHING,
                vesselSize = 23,
                vesselName = "Vessel Name",
                mmsi = "123456789",
                imo = "987654321",
                seizure = SeizureTypeEnum.NO,
            )
        val controlAction =
            EnvActionControlEntity(
                id = UUID.fromString("867af85e-d88d-42cc-ba50-28f302611a81"),
                observations = "RAS",
                actionNumberOfControls = 12,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                completion = ActionCompletionEnum.TO_COMPLETE,
                vehicleType = VehicleTypeEnum.VESSEL,
                infractions = listOf(infraction),
                tags = tags,
                themes = themes,
            )
        val surveillanceAction =
            EnvActionSurveillanceEntity(
                id = UUID.fromString("325a8c12-7c13-465d-9b42-6aee473d8d3b"),
                completion = ActionCompletionEnum.TO_COMPLETE,
                observations = "This is a surveillance action",
                awareness = null,
                tags = tags,
                themes = themes,
            )
        val noteAction =
            EnvActionNoteEntity(
                id = UUID.fromString("10cca413-f7e2-4a68-9c14-eea08bde0c29"),
                observations = "This is a note",
            )

        // list is sorted by id
        val envActions = listOf(noteAction, surveillanceAction, controlAction)

        val missionToUpdate =
            MissionEntity(
                id = id,
                missionTypes = listOf(MissionTypeEnum.LAND),
                openBy = "John Smith",
                completedBy = "Carol Tim",
                facade = "MEMN",
                geom = polygon,
                observationsCacem = null,
                observationsCnsp = null,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                envActions = envActions,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                createdAtUtc = null,
                updatedAtUtc = null,
            )
        val expectedUpdatedMission =
            MissionDetailsDTO(
                mission =
                    MissionEntity(
                        id = id,
                        missionTypes = listOf(MissionTypeEnum.LAND),
                        openBy = "John Smith",
                        completedBy = "Carol Tim",
                        facade = "MEMN",
                        geom = polygon,
                        observationsCacem = null,
                        observationsCnsp = null,
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        endDateTimeUtc =
                            ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                        isDeleted = false,
                        envActions = envActions,
                        missionSource = MissionSourceEnum.MONITORENV,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        isGeometryComputedFromControls = false,
                        createdAtUtc = null,
                        updatedAtUtc = null,
                    ),
            )
        // When
        jpaMissionRepository.save(missionToUpdate)
        val updatedMission = jpaMissionRepository.findFullMissionById(id)
        assertThat(updatedMission?.mission?.updatedAtUtc).isNotNull
        assertThat(updatedMission)
            .usingRecursiveComparison()
            .ignoringFields("mission.envActions.id", "mission.createdAtUtc", "mission.updatedAtUtc")
            .isEqualTo(expectedUpdatedMission)
    }

    @Test
    @Transactional
    fun `save Should update mission with associated envActions`() {
        val id = 10
        // Given
        val tags =
            listOf(
                aTag(
                    id = 1,
                    name = "PN",
                    startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                    endedAt = ZonedDateTime.parse("2030-12-31T00:00Z"),
                ),
            )
        val themes =
            listOf(
                aTheme(
                    id = 2,
                    name = "AMP sans réglementation particulière",
                    startedAt = ZonedDateTime.parse("2023-01-01T00:00Z"),
                    endedAt = ZonedDateTime.parse("2099-12-31T23:59:59Z"),
                ),
            )
        val envAction =
            EnvActionControlEntity(
                id = UUID.fromString("bf9f4062-83d3-4a85-b89b-76c0ded6473d"),
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                completion = ActionCompletionEnum.TO_COMPLETE,
                vehicleType = VehicleTypeEnum.VESSEL,
                actionNumberOfControls = 4,
                tags = tags,
                themes = themes,
            )
        val missionToUpdate =
            MissionEntity(
                id = id,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "NAMO",
                geom = polygon,
                observationsCacem = null,
                observationsCnsp = null,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                envActions = listOf(envAction),
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                createdAtUtc = null,
                updatedAtUtc = null,
            )
        val expectedUpdatedMission =
            MissionDetailsDTO(
                mission =
                    MissionEntity(
                        id = id,
                        missionTypes = listOf(MissionTypeEnum.LAND),
                        facade = "NAMO",
                        geom = polygon,
                        observationsCacem = null,
                        observationsCnsp = null,
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        endDateTimeUtc =
                            ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                        createdAtUtc = null,
                        updatedAtUtc = null,
                        isDeleted = false,
                        envActions = listOf(envAction),
                        missionSource = MissionSourceEnum.MONITORENV,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        isGeometryComputedFromControls = false,
                    ),
            )
        // When
        jpaMissionRepository.save(missionToUpdate)
        val updatedMission = jpaMissionRepository.findFullMissionById(id)
        assertThat(updatedMission)
            .usingRecursiveComparison()
            .ignoringFields("mission.id", "mission.envActions.id", "mission.createdAtUtc", "mission.updatedAtUtc")
            .isEqualTo(expectedUpdatedMission)
    }

    @Test
    @Transactional
    fun `save Should update themes of envActions`() {
        val mission = jpaMissionRepository.findById(34)!!
        val envAction =
            mission.envActions?.find {
                it.id == UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807")
            }!!
        when (envAction) {
            is EnvActionControlEntity -> {
                assertThat(envAction.themes.size).isEqualTo(1)
                assertThat(envAction.themes[0].subThemes.size).isEqualTo(1)
            }

            is EnvActionSurveillanceEntity -> {
                assertThat(envAction.themes.size).isEqualTo(1)
                assertThat(envAction.themes[0].subThemes.size).isEqualTo(1)
            }
        }
        val nextThemes =
            listOf(
                aTheme(id = 1, subThemes = listOf(aTheme(id = 170), aTheme(id = 146))),
                aTheme(id = 14, subThemes = listOf(aTheme(id = 359), aTheme(id = 360), aTheme(id = 366))),
                aTheme(id = 10),
            )
        val nextMission =
            mission.copy(
                envActions =
                    mission.envActions.map {
                        if (it.id ==
                            UUID.fromString(
                                "b8007c8a-5135-4bc3-816f-c69c7b75d807",
                            ) &&
                            it is EnvActionControlEntity
                        ) {
                            it.copy(themes = nextThemes)
                        } else {
                            it
                        }
                    },
            )
        val updatedMission = jpaMissionRepository.save(nextMission)
        val updatedEnvAction =
            updatedMission.mission.envActions
                ?.find { it.id == UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807") } as EnvActionControlEntity
        assertThat(updatedEnvAction.themes.size).isEqualTo(3)
        updatedEnvAction.themes.find { it.id == 10 }.let {
            assertThat(it?.subThemes).hasSize(0)
        }
        updatedEnvAction.themes.find { it.id == 1 }.let {
            assertThat(it?.subThemes).hasSize(2)
        }
        updatedEnvAction.themes.find { it.id == 14 }.let {
            assertThat(it?.subThemes).hasSize(3)
        }
    }

    @Test
    fun `addLegacyControlPlans should add controlPlans to envAction`() {
        // Given
        val mission = jpaMissionRepository.findById(34)
        val envAction =
            mission?.envActions?.find {
                it.id == UUID.fromString("c52c6f20-e495-4b29-b3df-d7edfb67fdd7")
            } as EnvActionSurveillanceEntity
        // When
        jpaMissionRepository.addLegacyControlPlans(mission)

        // Then
        assertThat(envAction.controlPlans).containsExactlyInAnyOrder(
            EnvActionControlPlanEntity(
                themeId = 100,
                subThemeIds = listOf(178, 180),
                tagIds = listOf(),
            ),
            EnvActionControlPlanEntity(
                themeId = 103,
                subThemeIds = listOf(195, 196),
                tagIds = listOf(11),
            ),
        )
        val expectedThemes =
            listOf(
                aTheme(
                    id = 100,
                    subThemes =
                        listOf(
                            aTheme(
                                id = 327, // subThemeId = 180
                            ),
                            aTheme(
                                id = 329, // subThemeId = 178
                            ),
                        ),
                ),
                aTheme(
                    id = 103,
                    subThemes =
                        listOf(
                            aTheme(
                                id = 279, // subThemeId = 196
                            ),
                            aTheme(
                                id = 312, // subThemeId = 195
                            ),
                            aTheme(
                                id = 355, // tagId = 11
                            ),
                        ),
                ),
            )

        expectedThemes.forEach { expectedTheme ->
            assertThat(envAction.themes).anySatisfy { actualTheme ->
                assertThat(actualTheme)
                    .usingRecursiveComparison()
                    .ignoringCollectionOrder()
                    .ignoringFields(
                        "name",
                        "startedAt",
                        "endedAt",
                        "subThemes.name",
                        "subThemes.startedAt",
                        "subThemes.endedAt",
                    ).isEqualTo(expectedTheme)
            }
        }
    }

    @Test
    fun `addLegacyControlPlans should not add controlPlans to envAction when it got no themes`() {
        // Given
        val mission = jpaMissionRepository.findById(53)
        val envAction =
            mission?.envActions?.find {
                it.id == UUID.fromString("2cdcd429-19ab-45ed-a892-7c695bd256e2")
            } as EnvActionSurveillanceEntity
        // When
        jpaMissionRepository.addLegacyControlPlans(mission)

        // Then
        assertThat(envAction.controlPlans).isEmpty()
        assertThat(envAction.themes).isEmpty()
    }
}
