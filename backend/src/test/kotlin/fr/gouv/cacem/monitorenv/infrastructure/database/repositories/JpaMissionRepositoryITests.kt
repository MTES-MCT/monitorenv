package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.*
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.catchThrowable
import org.junit.jupiter.api.Test
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.transaction.annotation.Transactional
import java.time.ZonedDateTime
import java.util.*

class JpaMissionRepositoryITests : AbstractDBTests() {
    @Autowired private lateinit var jpaMissionRepository: JpaMissionRepository

    @Autowired private lateinit var jpaControlUnitRepository: JpaControlUnitRepository

    @Autowired
    private lateinit var jpaControlUnitResourceRepository: JpaControlUnitResourceRepository

    private val polygon = WKTReader().read(
        "MULTIPOLYGON (((-4.54877817 48.30555988, -4.54997332 48.30597601, -4.54998501 48.30718823, -4.5487929 48.30677461, -4.54877817 48.30555988)))",
    ) as MultiPolygon
    private val point = WKTReader().read("POINT (-4.54877816747593 48.305559876971)") as Point

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
                pageable = Pageable.unpaged(),
            )
        assertThat(missionsList).hasSize(21)

        // When
        jpaMissionRepository.delete(3)

        // Then
        val nextMissionList =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2022-08-08T00:00:00Z").toInstant(),
                missionTypes = null,
                missionStatuses = null,
                seaFronts = null,
                pageable = Pageable.unpaged(),
            )
        assertThat(nextMissionList).hasSize(20)
    }

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
                pageable = Pageable.unpaged(),
            )
        assertThat(missions).hasSize(54)
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
                pageable = Pageable.unpaged(),
            )
        assertThat(missions).hasSize(21)
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when missionTypes is set`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = listOf("SEA"),
                missionStatuses = null,
                seaFronts = null,
                pageable = Pageable.unpaged(),
            )
        assertThat(missions).hasSize(22)
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when multiple missionTypes are set`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = listOf("SEA", "LAND"),
                missionStatuses = null,
                seaFronts = null,
                pageable = Pageable.unpaged(),
            )
        assertThat(missions).hasSize(45)
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
                pageable = Pageable.unpaged(),
            )
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
                pageable = Pageable.unpaged(),
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
                pageable = Pageable.unpaged(),
            )
        assertThat(missions).hasSize(7)
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
                pageable = Pageable.unpaged(),
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
                pageable = Pageable.unpaged(),
            )
        assertThat(missions).hasSize(15)
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when status is set to CLOSED`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                seaFronts = null,
                missionStatuses = listOf("CLOSED"),
                pageable = Pageable.unpaged(),
            )
        assertThat(missions).hasSize(18)
    }

    @Test
    @Transactional
    fun `findAll Should return filtered missions when status is set to CLOSED or UPCOMING`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                seaFronts = null,
                missionStatuses = listOf("CLOSED", "UPCOMING"),
                pageable = Pageable.unpaged(),
            )
        assertThat(missions).hasSize(25)
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
                pageable = PageRequest.of(1, 10),
            )
        assertThat(missions).hasSize(10)
    }

    @Test
    @Transactional
    fun `findAll should filter missions based on MissionSources`() {
        // When
        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2000-01-01T00:01:00Z").toInstant(),
                startedBefore = null,
                missionTypes = null,
                missionStatuses = null,
                seaFronts = null,
                missionSources =
                listOf(
                    MissionSourceEnum.MONITORFISH,
                    MissionSourceEnum.POSEIDON_CACEM,
                    MissionSourceEnum.POSEIDON_CNSP,
                ),
                pageable = Pageable.unpaged(),
            )
        assertThat(missions).hasSize(3)
    }

    @Test
    @Transactional
    fun `findByControlUnitId should find the matching missions`() {
        val foundMissions = jpaMissionRepository.findByControlUnitId(10002)

        assertThat(foundMissions).hasSize(17)
    }

    @Test
    @Transactional
    fun `findByControlUnitResourceId should find the matching missions`() {
        val foundMissions = jpaMissionRepository.findByControlUnitResourceId(8)

        assertThat(foundMissions).hasSize(4)
    }

    @Test
    @Transactional
    fun `findById Should return specified mission`() {
        // When
        val firstMission =
            MissionDTO(
                mission =
                MissionEntity(
                    id = 10,
                    missionTypes = listOf(MissionTypeEnum.LAND),
                    openBy = "KIM",
                    closedBy = "TRA",
                    facade = "NAMO",
                    observationsCacem =
                    "Remain vote several ok. Bring American play woman challenge. Throw low law positive seven.",
                    startDateTimeUtc =
                    ZonedDateTime.parse("2022-03-21T12:11:13Z"),
                    endDateTimeUtc = null,
                    geom = polygon,
                    isClosed = false,
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
                ),
            )
        val mission = jpaMissionRepository.findFullMissionById(10)

        assertThat(mission).isEqualTo(firstMission)
    }

    @Test
    @Transactional
    fun `findById Should return specified mission and associated env actions and associated envActionReportingIds`() {
        // When
        val missionDTO = jpaMissionRepository.findFullMissionById(34)
        assertThat(missionDTO.mission.id).isEqualTo(34)
        assertThat(missionDTO.mission.envActions).hasSize(2)
        assertThat(
            missionDTO.envActionsAttachedToReportingIds?.get(0)?.first,
        )
            .isEqualTo(UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807"))
        assertThat(missionDTO.envActionsAttachedToReportingIds?.get(0)?.second).isEqualTo(listOf(6))
    }

    @Test
    @Transactional
    fun `findByIds() should find the matching missions`() {
        val foundMissions = jpaMissionRepository.findByIds(listOf(50, 51, 52))

        assertThat(foundMissions).hasSize(3)
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
                pageable = Pageable.unpaged(),
            )

        assertThat(existingMissions).hasSize(21)

        val noteObservations = "Quelqu'un aurait vu quelque chose quelque part à un certain moment."

        val newMission =
            MissionEntity(
                missionTypes = listOf(MissionTypeEnum.SEA),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                isClosed = false,
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
                        controlPlans = listOf(
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
                    ),
                    EnvActionSurveillanceEntity(
                        id =
                        UUID.fromString(
                            "a6c4bd17-eb45-4504-ab15-7a18ea714a10",
                        ),
                        facade = "Facade 2",
                        department = "Department 2",
                        geom = polygon,
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
            )

        // When
        val newMissionCreated = jpaMissionRepository.save(newMission)

        // Then
        assertThat(newMissionCreated.mission.createdAtUtc).isAfter(ZonedDateTime.now().minusMinutes(1))
        assertThat(newMissionCreated.mission.updatedAtUtc).isAfter(ZonedDateTime.now().minusMinutes(1))
        assertThat(newMissionCreated.mission.controlUnits).hasSize(1)
        assertThat(newMissionCreated.mission.controlUnits.first().id).isEqualTo(10121)
        assertThat(newMissionCreated.mission.controlUnits.first().name)
            .isEqualTo("PAM Jeanne Barret")
        assertThat(newMissionCreated.mission.controlUnits.first().administration)
            .isEqualTo("DIRM / DM")
        assertThat(newMissionCreated.mission.controlUnits.first().resources).hasSize(1)
        assertThat(newMissionCreated.mission.controlUnits.first().resources.first().id).isEqualTo(8)
        assertThat(newMissionCreated.mission.controlUnits.first().resources.first().controlUnitId)
            .isEqualTo(10121)
        assertThat(newMissionCreated.mission.controlUnits.first().resources.first().name)
            .isEqualTo("PAM Jeanne Barret")
        assertThat(newMissionCreated.mission.envActions).hasSize(3)
        assertThat(newMissionCreated.mission.envActions?.first()?.facade).isEqualTo("Facade 1")
        assertThat(newMissionCreated.mission.envActions?.first()?.department)
            .isEqualTo("Department 1")
        assertThat(newMissionCreated.mission.envActions?.get(1)?.facade).isEqualTo("Facade 2")
        assertThat(newMissionCreated.mission.envActions?.get(1)?.department)
            .isEqualTo("Department 2")
        assertThat(
            (newMissionCreated.mission.envActions?.get(2) as EnvActionNoteEntity)
                .observations,
        )
            .isEqualTo(
                noteObservations,
            )

        val missions =
            jpaMissionRepository.findAllFullMissions(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2022-08-08T00:00:00Z").toInstant(),
                missionTypes = null,
                missionStatuses = null,
                seaFronts = null,
                pageable = Pageable.unpaged(),
            )

        assertThat(missions).hasSize(22)
    }

    @Test
    @Transactional
    fun `save should update mission resources`() {
        // Given
        val newMission =
            MissionEntity(
                missionTypes = listOf(MissionTypeEnum.SEA),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                isClosed = false,
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
            )
        jpaMissionRepository.save(newMission)

        // When
        val newMissionUpdated =
            jpaMissionRepository.save(
                newMission.copy(
                    controlUnits =
                    listOf(
                        LegacyControlUnitEntity(
                            id = 10002,
                            name = "DML 2A",
                            administration = "DIRM / DM",
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
        assertThat(newMissionUpdated.mission.controlUnits).hasSize(1)
        assertThat(newMissionUpdated.mission.controlUnits.first().id).isEqualTo(10002)
        assertThat(newMissionUpdated.mission.controlUnits.first().name).isEqualTo("DML 2A")
        assertThat(newMissionUpdated.mission.controlUnits.first().administration)
            .isEqualTo("DIRM / DM")
        assertThat(newMissionUpdated.mission.controlUnits.first().resources).hasSize(2)
        assertThat(newMissionUpdated.mission.controlUnits.first().resources.first().id).isEqualTo(3)
        assertThat(newMissionUpdated.mission.controlUnits.first().resources.first().controlUnitId)
            .isEqualTo(10002)
        assertThat(newMissionUpdated.mission.controlUnits.first().resources.first().name)
            .isEqualTo("Semi-rigide 1")
        assertThat(newMissionUpdated.mission.controlUnits.first().resources.last().id).isEqualTo(5)
        assertThat(newMissionUpdated.mission.controlUnits.first().resources.last().controlUnitId)
            .isEqualTo(10002)
        assertThat(newMissionUpdated.mission.controlUnits.first().resources.last().name)
            .isEqualTo("Voiture")
    }

    @Test
    @Transactional
    fun `save should update existing mission with existing resources`() {
        // Given
        val mission = jpaMissionRepository.findById(25)
        val newControlUnitResource = jpaControlUnitResourceRepository.findById(10)
        val newControlUnit =
            jpaControlUnitRepository.findById(
                requireNotNull(newControlUnitResource.controlUnit.id),
            )

        val nextMission =
            mission.copy(
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

        val updatedMission = jpaMissionRepository.save(nextMission)

        assertThat(updatedMission.mission.createdAtUtc).isNull()
        assertThat(updatedMission.mission.updatedAtUtc).isAfter(ZonedDateTime.now().minusMinutes(1))
        assertThat(updatedMission.mission.controlUnits).hasSize(2)
        assertThat(updatedMission.mission.controlUnits.first().id).isEqualTo(10002)
        assertThat(updatedMission.mission.controlUnits.first().resources).hasSize(1)
        assertThat(updatedMission.mission.controlUnits.first().resources.first().id).isEqualTo(3)
        assertThat(updatedMission.mission.controlUnits.first().resources.first().controlUnitId)
            .isEqualTo(10002)
        assertThat(updatedMission.mission.controlUnits.last().id).isEqualTo(10018)
        assertThat(updatedMission.mission.controlUnits.last().resources).hasSize(1)
        assertThat(updatedMission.mission.controlUnits.last().resources.first().id).isEqualTo(10)
        assertThat(updatedMission.mission.controlUnits.last().resources.first().controlUnitId)
            .isEqualTo(10018)
    }

    @Test
    @Transactional
    fun `save should throw an exception When the resource id is not found`() {
        // Given
        val newMission =
            MissionEntity(
                missionTypes = listOf(MissionTypeEnum.SEA),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                isClosed = false,
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                controlUnits =
                listOf(
                    LegacyControlUnitEntity(
                        id = 5,
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
            )

        // When
        val throwable = catchThrowable { jpaMissionRepository.save(newMission) }

        // Then
        assertThat(throwable).isInstanceOf(InvalidDataAccessApiUsageException::class.java)
    }

    @Test
    @Transactional
    fun `save should throw an exception When the unit id is not found`() {
        // Given
        val newMission =
            MissionEntity(
                missionTypes = listOf(MissionTypeEnum.SEA),
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                isClosed = false,
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
            )

        // When
        val throwable = catchThrowable { jpaMissionRepository.save(newMission) }

        // Then
        assertThat(throwable).isInstanceOf(DataIntegrityViolationException::class.java)
    }

    @Test
    @Transactional
    fun `save Should update mission`() {
        // Given
        val infraction =
            InfractionEntity(
                id = UUID.randomUUID().toString(),
                natinf = listOf("53432"),
                observations = "This is an infraction",
                registrationNumber = "REGISTRATION NUM",
                companyName = "ACME inc.",
                relevantCourt = "MARITIME_COURT",
                infractionType = InfractionTypeEnum.WITHOUT_REPORT,
                formalNotice = FormalNoticeEnum.NO,
                toProcess = false,
                controlledPersonIdentity = "Dick Hoover",
                vesselType = VesselTypeEnum.FISHING,
                vesselSize = VesselSizeEnum.FROM_12_TO_24m,
            )
        val controlAction =
            EnvActionControlEntity(
                id = UUID.randomUUID(),
                observations = "RAS",
                actionNumberOfControls = 12,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                infractions = listOf(infraction),
            )
        val surveillanceAction =
            EnvActionSurveillanceEntity(
                id = UUID.randomUUID(),
                observations = "This is a surveillance action",
            )
        val noteAction =
            EnvActionNoteEntity(
                id = UUID.randomUUID(),
                observations = "This is a note",
            )

        val missionToUpdate =
            MissionEntity(
                id = 10,
                missionTypes = listOf(MissionTypeEnum.LAND),
                openBy = "John Smith",
                closedBy = "Carol Tim",
                facade = "MEMN",
                geom = polygon,
                observationsCacem = null,
                observationsCnsp = null,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isClosed = false,
                isDeleted = false,
                envActions = listOf(controlAction, surveillanceAction, noteAction),
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            )
        val expectedUpdatedMission =
            MissionDTO(
                mission =
                MissionEntity(
                    id = 10,
                    missionTypes = listOf(MissionTypeEnum.LAND),
                    openBy = "John Smith",
                    closedBy = "Carol Tim",
                    facade = "MEMN",
                    geom = polygon,
                    observationsCacem = null,
                    observationsCnsp = null,
                    startDateTimeUtc =
                    ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    endDateTimeUtc =
                    ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                    isClosed = false,
                    isDeleted = false,
                    envActions =
                    listOf(
                        controlAction,
                        surveillanceAction,
                        noteAction,
                    ),
                    missionSource = MissionSourceEnum.MONITORENV,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                ),
            )
        // When
        jpaMissionRepository.save(missionToUpdate)
        val updatedMission = jpaMissionRepository.findFullMissionById(10)
        assertThat(
            updatedMission.copy(
                mission = updatedMission.mission.copy(
                    createdAtUtc = null,
                    updatedAtUtc = null,
                ),
            ),
        ).isEqualTo(expectedUpdatedMission)
    }

    @Test
    @Transactional
    fun `save Should update mission with associated envActions`() {
        // Given

        val envAction =
            EnvActionControlEntity(
                id = UUID.fromString("bf9f4062-83d3-4a85-b89b-76c0ded6473d"),
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                actionNumberOfControls = 4,
            )
        val missionToUpdate =
            MissionEntity(
                id = 10,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "NAMO",
                geom = polygon,
                observationsCacem = null,
                observationsCnsp = null,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isClosed = false,
                isDeleted = false,
                envActions = listOf(envAction),
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            )
        val expectedUpdatedMission =
            MissionDTO(
                mission =
                MissionEntity(
                    id = 10,
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
                    isClosed = false,
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
        val updatedMission = jpaMissionRepository.findFullMissionById(10)
        assertThat(
            updatedMission.copy(
                mission = updatedMission.mission.copy(
                    createdAtUtc = null,
                    updatedAtUtc = null,
                ),
            ),
        ).isEqualTo(expectedUpdatedMission)
    }

    @Test
    @Transactional
    fun `save Should update subThemes of envActions`() {
        val mission = jpaMissionRepository.findById(34)
        val envAction = mission.envActions?.find { it.id == UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807") }
        assertThat(envAction?.controlPlans?.size).isEqualTo(1)
        assertThat(envAction?.controlPlans?.get(0)?.subThemeIds?.size).isEqualTo(1)
        val nextControlPlans = listOf(
            EnvActionControlPlanEntity(
                subThemeIds = listOf(53, 34),
                themeId = 2,
            ),
            EnvActionControlPlanEntity(
                tagIds = listOf(1, 2, 3),
                themeId = 11,
            ),
            EnvActionControlPlanEntity(
                themeId = 17,
            ),
        )
        val nextMission = mission.copy(
            envActions = mission.envActions?.map {
                if (it.id == UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807") && it is EnvActionControlEntity) {
                    it.copy(controlPlans = nextControlPlans)
                } else {
                    it
                }
            },
        )
        val updatedMission = jpaMissionRepository.save(nextMission)
        val updatedControlPlan = updatedMission.mission.envActions?.find {
            it.id == UUID.fromString("b8007c8a-5135-4bc3-816f-c69c7b75d807")
        }?.controlPlans
        assertThat(updatedControlPlan?.size).isEqualTo(3)
        assertThat(updatedControlPlan?.get(0)?.subThemeIds?.size).isEqualTo(2)
        assertThat(updatedControlPlan?.get(0)?.subThemeIds?.get(0)).isEqualTo(53)
        assertThat(updatedControlPlan?.get(1)?.tagIds?.size).isEqualTo(3)
        assertThat(updatedControlPlan?.get(1)?.tagIds?.get(0)).isEqualTo(1)
    }
}
