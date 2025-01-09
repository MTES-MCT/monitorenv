@file:Suppress("ktlint:standard:package-name")

package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.*
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.ReportingAlreadyAttachedException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IReportingRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.TestUtils.getReportingDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.TestUtils.getReportingDTOWithAttachedMission
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.assertj.core.api.Assertions.assertThat
import org.assertj.core.api.Assertions.assertThatThrownBy
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime
import java.util.*

@ExtendWith(SpringExtension::class)
class CreateOrUpdateMissionWithActionsAndAttachedReportingUTests {
    @Mock
    private val createOrUpdateMission: CreateOrUpdateMission = mock()

    @Mock
    private val createOrUpdateEnvActions: CreateOrUpdateEnvActions = mock()

    @Mock
    private val missionRepository: IMissionRepository = mock()

    @Mock
    private val reportingRepository: IReportingRepository = mock()

    @Mock
    private val getFullMissionWithFishAndRapportNavActions: GetFullMissionWithFishAndRapportNavActions = mock()

    @Mock
    private val getFullMission: GetFullMission = mock()

    val wktReader = WKTReader()

    val multipolygonString =
        "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
    val polygon = wktReader.read(multipolygonString) as MultiPolygon

    @Test
    fun `should attach mission to specified reportings`() {
        // Given
        val missionToCreate =
            MissionEntity(
                id = 100,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = polygon,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            )
        val attachedReportingIds = listOf(1, 2, 3)

        val expectedCreatedMission =
            MissionDTO(
                mission =
                    MissionEntity(
                        id = 100,
                        missionTypes = listOf(MissionTypeEnum.LAND),
                        facade = "Outre-Mer",
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        endDateTimeUtc =
                            ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                        isDeleted = false,
                        missionSource = MissionSourceEnum.MONITORENV,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        isGeometryComputedFromControls = false,
                    ),
                attachedReportingIds = attachedReportingIds,
            )

        given(createOrUpdateMission.execute(anyOrNull())).willReturn(missionToCreate.copy(id = 100))
        given(missionRepository.save(anyOrNull()))
            .willReturn(MissionDTO(mission = missionToCreate.copy(id = 100)))
        given(reportingRepository.findById(1)).willReturn(getReportingDTO(1))
        given(reportingRepository.findById(2)).willReturn(getReportingDTO(2))
        given(reportingRepository.findById(3)).willReturn(getReportingDTO(3))
        given(getFullMissionWithFishAndRapportNavActions.execute(100)).willReturn(Pair(true, expectedCreatedMission))
        // When
        val (_, createdMissionDTO) =
            CreateOrUpdateMissionWithActionsAndAttachedReporting(
                createOrUpdateMission = createOrUpdateMission,
                createOrUpdateEnvActions = createOrUpdateEnvActions,
                reportingRepository = reportingRepository,
                getFullMissionWithFishAndRapportNavActions = getFullMissionWithFishAndRapportNavActions,
                getFullMission = getFullMission,
            )
                .execute(
                    mission = missionToCreate,
                    attachedReportingIds = attachedReportingIds,
                    envActionsAttachedToReportingIds = listOf(),
                )

        // Then
        verify(reportingRepository, times(1)).attachReportingsToMission(attachedReportingIds, 100)
        assertThat(createdMissionDTO).isEqualTo(expectedCreatedMission)
    }

    @Test
    fun `execute should throw ReportingAlreadyAttachedException when try to attach reporting that has already be attached`() {
        val missionToCreate =
            MissionEntity(
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = polygon,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
            )
        val attachedReportingIds = listOf(5)
        given(createOrUpdateMission.execute(anyOrNull())).willReturn(missionToCreate.copy(id = 100))
        given(reportingRepository.findById(5)).willReturn(getReportingDTOWithAttachedMission(5))

        // Then
        assertThatThrownBy {
            CreateOrUpdateMissionWithActionsAndAttachedReporting(
                createOrUpdateMission = createOrUpdateMission,
                createOrUpdateEnvActions = createOrUpdateEnvActions,
                reportingRepository = reportingRepository,
                getFullMissionWithFishAndRapportNavActions = getFullMissionWithFishAndRapportNavActions,
                getFullMission = getFullMission,
            )
                .execute(
                    mission = missionToCreate,
                    attachedReportingIds = attachedReportingIds,
                    envActionsAttachedToReportingIds = listOf(),
                )
        }
            .isInstanceOf(ReportingAlreadyAttachedException::class.java)
    }

    @Test
    fun `Should attach action to reporting`() {
        // Given
        val envActionControl =
            EnvActionControlEntity(
                id = UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
                geom = polygon,
            )

        val missionToCreate =
            MissionEntity(
                id = 100,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = polygon,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                envActions = listOf(envActionControl),
            )
        val attachedReportingIds = listOf(1, 2, 3)

        val expectedCreatedMission =
            MissionDTO(
                mission =
                    MissionEntity(
                        id = 100,
                        missionTypes = listOf(MissionTypeEnum.LAND),
                        facade = "Outre-Mer",
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        endDateTimeUtc =
                            ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                        isDeleted = false,
                        missionSource = MissionSourceEnum.MONITORENV,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        isGeometryComputedFromControls = false,
                    ),
                attachedReportingIds = attachedReportingIds,
            )
        val envActionAttachedToReportingIds = Pair(envActionControl.id, listOf(1))

        given(createOrUpdateMission.execute(anyOrNull())).willReturn(missionToCreate)
        given(missionRepository.save(anyOrNull()))
            .willReturn(MissionDTO(mission = missionToCreate.copy(id = 100)))
        given(reportingRepository.findById(1)).willReturn(getReportingDTO(1))
        given(reportingRepository.findById(2)).willReturn(getReportingDTO(2))
        given(reportingRepository.findById(3)).willReturn(getReportingDTO(3))
        given(getFullMissionWithFishAndRapportNavActions.execute(100)).willReturn(Pair(true, expectedCreatedMission))

        // When
        val (_, createdMissionDTO) =
            CreateOrUpdateMissionWithActionsAndAttachedReporting(
                createOrUpdateMission = createOrUpdateMission,
                createOrUpdateEnvActions = createOrUpdateEnvActions,
                reportingRepository = reportingRepository,
                getFullMissionWithFishAndRapportNavActions = getFullMissionWithFishAndRapportNavActions,
                getFullMission = getFullMission,
            )
                .execute(
                    mission = missionToCreate,
                    attachedReportingIds = attachedReportingIds,
                    envActionsAttachedToReportingIds =
                        listOf(
                            envActionAttachedToReportingIds,
                        ),
                )

        // Then
        verify(reportingRepository, times(1))
            .detachDanglingEnvActions(
                missionId = 100,
                envActionIds = listOf(envActionControl.id),
            )
        verify(reportingRepository, times(1)).attachReportingsToMission(attachedReportingIds, 100)
        verify(
            reportingRepository,
            times(1),
        )
            .attachEnvActionsToReportings(
                envActionAttachedToReportingIds.first,
                envActionAttachedToReportingIds.second,
            )
        assertThat(createdMissionDTO).isEqualTo(expectedCreatedMission)
    }

    @Test
    fun `Should return status 206 if fish api doesn't responds`() {
        // Given
        val envActionControl =
            EnvActionControlEntity(
                id = UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
                geom = polygon,
            )

        val missionToCreate =
            MissionEntity(
                id = 100,
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = polygon,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                envActions = listOf(envActionControl),
            )

        val expectedCreatedMission =
            MissionDTO(
                mission =
                    MissionEntity(
                        id = 100,
                        missionTypes = listOf(MissionTypeEnum.LAND),
                        facade = "Outre-Mer",
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        endDateTimeUtc =
                            ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                        isDeleted = false,
                        missionSource = MissionSourceEnum.MONITORENV,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        isGeometryComputedFromControls = false,
                    ),
            )

        given(createOrUpdateMission.execute(anyOrNull())).willReturn(missionToCreate)
        given(missionRepository.save(anyOrNull()))
            .willReturn(MissionDTO(mission = missionToCreate.copy(id = 100)))
        given(getFullMissionWithFishAndRapportNavActions.execute(100)).willReturn(Pair(false, expectedCreatedMission))

        // When
        val (fishResponds, createdMissionDTO) =
            CreateOrUpdateMissionWithActionsAndAttachedReporting(
                createOrUpdateMission = createOrUpdateMission,
                createOrUpdateEnvActions = createOrUpdateEnvActions,
                reportingRepository = reportingRepository,
                getFullMissionWithFishAndRapportNavActions = getFullMissionWithFishAndRapportNavActions,
                getFullMission = getFullMission,
            )
                .execute(
                    mission = missionToCreate,
                    attachedReportingIds = listOf(),
                    envActionsAttachedToReportingIds = listOf(),
                )

        // Then
        assertThat(fishResponds).isFalse()
        assertThat(createdMissionDTO).isEqualTo(expectedCreatedMission)
    }

    @Test
    fun `Should create a mission doesn't call getFullMissionWithFishAndRapportNavActions`() {
        val missionToCreate =
            MissionEntity(
                missionTypes = listOf(MissionTypeEnum.LAND),
                facade = "Outre-Mer",
                geom = polygon,
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isDeleted = false,
                missionSource = MissionSourceEnum.MONITORENV,
                hasMissionOrder = false,
                isUnderJdp = false,
                isGeometryComputedFromControls = false,
                envActions = listOf(),
            )

        val expectedCreatedMission =
            MissionDTO(
                mission =
                    MissionEntity(
                        id = 100,
                        missionTypes = listOf(MissionTypeEnum.LAND),
                        facade = "Outre-Mer",
                        startDateTimeUtc =
                            ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                        endDateTimeUtc =
                            ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                        isDeleted = false,
                        missionSource = MissionSourceEnum.MONITORENV,
                        hasMissionOrder = false,
                        isUnderJdp = false,
                        isGeometryComputedFromControls = false,
                    ),
            )

        given(createOrUpdateMission.execute(anyOrNull())).willReturn(missionToCreate.copy(id = 100))
        given(missionRepository.save(anyOrNull()))
            .willReturn(MissionDTO(mission = missionToCreate.copy(id = 100)))
        given(getFullMission.execute(100)).willReturn(expectedCreatedMission)

        // When
        val (fishResponds, createdMissionDTO) =
            CreateOrUpdateMissionWithActionsAndAttachedReporting(
                createOrUpdateMission = createOrUpdateMission,
                createOrUpdateEnvActions = createOrUpdateEnvActions,
                reportingRepository = reportingRepository,
                getFullMissionWithFishAndRapportNavActions = getFullMissionWithFishAndRapportNavActions,
                getFullMission = getFullMission,
            )
                .execute(
                    mission = missionToCreate,
                    attachedReportingIds = listOf(),
                    envActionsAttachedToReportingIds = listOf(),
                )

        // Then
        verifyNoMoreInteractions(getFullMissionWithFishAndRapportNavActions)
        assertThat(fishResponds).isTrue()
        assertThat(createdMissionDTO).isEqualTo(expectedCreatedMission)
    }
}
