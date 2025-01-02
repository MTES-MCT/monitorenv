package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.CanDeleteMissionResponse
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MonitorFishActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.locationtech.jts.geom.MultiPolygon
import org.locationtech.jts.io.WKTReader
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime
import java.util.UUID

@ExtendWith(SpringExtension::class)
@ExtendWith(OutputCaptureExtension::class)
class CanDeleteMissionUTests {
    @Mock
    private val missionRepository: IMissionRepository = mock()

    @Mock
    private val monitorFishMissionActionsRepository: IMonitorFishMissionActionsRepository = mock()

    @Mock
    private val rapportNavMissionActionsRepository: IRapportNavMissionActionsRepository = mock()

    @Test
    fun `execute Should return true when haven't Env Actions and RapportNav Actions and request come from Fish`(
        log: CapturedOutput,
    ) {
        val missionId = 57

        given(missionRepository.findById(missionId))
            .willReturn(
                MissionEntity(
                    id = 57,
                    missionTypes = listOf(MissionTypeEnum.LAND),
                    facade = "Outre-Mer",
                    geom = null,
                    startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                    isDeleted = false,
                    missionSource = MissionSourceEnum.MONITORENV,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                    envActions = listOf(),
                ),
            )
        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId))
            .willReturn(
                RapportNavMissionActionEntity(
                    id = 1,
                    containsActionsAddedByUnit = false,
                ),
            )

        val result =
            CanDeleteMission(
                missionRepository = missionRepository,
                monitorFishMissionActionsRepository =
                monitorFishMissionActionsRepository,
                rapportNavMissionActionsRepository = rapportNavMissionActionsRepository,
            )
                .execute(missionId, MissionSourceEnum.MONITORFISH)

        assertThat(result).isEqualTo(CanDeleteMissionResponse(true, listOf()))
        assertThat(log.out).contains("Can mission $missionId be deleted")
    }

    @Test
    fun `execute Should return a list when have Env Actions but no RapportNav Actions and request come from Fish`(
        log: CapturedOutput,
    ) {
        val missionId = 34

        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        val envActionControl =
            EnvActionControlEntity(
                id = UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
                geom = polygon,
            )
        given(missionRepository.findById(missionId))
            .willReturn(
                MissionEntity(
                    id = 34,
                    missionTypes = listOf(MissionTypeEnum.LAND),
                    facade = "Outre-Mer",
                    geom = null,
                    startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                    isDeleted = false,
                    missionSource = MissionSourceEnum.MONITORENV,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                    envActions = listOf(envActionControl),
                ),
            )
        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId))
            .willReturn(
                RapportNavMissionActionEntity(
                    id = 1,
                    containsActionsAddedByUnit = false,
                ),
            )

        val result =
            CanDeleteMission(
                missionRepository = missionRepository,
                monitorFishMissionActionsRepository =
                monitorFishMissionActionsRepository,
                rapportNavMissionActionsRepository = rapportNavMissionActionsRepository,
            )
                .execute(missionId, MissionSourceEnum.MONITORFISH)

        assertThat(result).isEqualTo(CanDeleteMissionResponse(false, listOf(MissionSourceEnum.MONITORENV)))
        assertThat(log.out).contains("Can mission $missionId be deleted")
    }

    @Test
    fun `execute Should return a list when have Env actions and RapportNav actions and request come from Fish`() {
        val missionId = 53

        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        val envActionControl =
            EnvActionControlEntity(
                id = UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
                geom = polygon,
            )
        given(missionRepository.findById(missionId))
            .willReturn(
                MissionEntity(
                    id = 53,
                    missionTypes = listOf(MissionTypeEnum.LAND),
                    facade = "Outre-Mer",
                    geom = null,
                    startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                    isDeleted = false,
                    missionSource = MissionSourceEnum.MONITORENV,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                    envActions = listOf(envActionControl),
                ),
            )
        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId))
            .willReturn(
                RapportNavMissionActionEntity(
                    id = 1,
                    containsActionsAddedByUnit = true,
                ),
            )

        val result =
            CanDeleteMission(
                missionRepository = missionRepository,
                monitorFishMissionActionsRepository =
                monitorFishMissionActionsRepository,
                rapportNavMissionActionsRepository = rapportNavMissionActionsRepository,
            )
                .execute(missionId, MissionSourceEnum.MONITORFISH)

        assertThat(result).isEqualTo(
            CanDeleteMissionResponse(false, listOf(MissionSourceEnum.MONITORENV, MissionSourceEnum.RAPPORT_NAV)),
        )
    }

    @Test
    fun `execute Should return true when haven't actions from Fish and RapportNav and request come from Env`() {
        val missionId = 57

        given(missionRepository.findById(missionId))
            .willReturn(
                MissionEntity(
                    id = 57,
                    missionTypes = listOf(MissionTypeEnum.LAND),
                    facade = "Outre-Mer",
                    geom = null,
                    startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                    isDeleted = false,
                    missionSource = MissionSourceEnum.MONITORENV,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                    envActions = listOf(),
                ),
            )

        given(monitorFishMissionActionsRepository.findFishMissionActionsById(missionId))
            .willReturn(listOf())

        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId))
            .willReturn(
                RapportNavMissionActionEntity(
                    id = 1,
                    containsActionsAddedByUnit = false,
                ),
            )

        val result =
            CanDeleteMission(
                missionRepository = missionRepository,
                monitorFishMissionActionsRepository =
                monitorFishMissionActionsRepository,
                rapportNavMissionActionsRepository = rapportNavMissionActionsRepository,
            )
                .execute(missionId, MissionSourceEnum.MONITORENV)

        assertThat(result).isEqualTo(CanDeleteMissionResponse(true, listOf()))
    }

    @Test
    fun `execute Should return a list when have Fish Actions but no RapportNav Actions and request come from Env`() {
        val missionId = 57

        given(missionRepository.findById(missionId))
            .willReturn(
                MissionEntity(
                    id = 57,
                    missionTypes = listOf(MissionTypeEnum.LAND),
                    facade = "Outre-Mer",
                    geom = null,
                    startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                    isDeleted = false,
                    missionSource = MissionSourceEnum.MONITORENV,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                    envActions = listOf(),
                ),
            )

        given(monitorFishMissionActionsRepository.findFishMissionActionsById(missionId))
            .willReturn(
                listOf(
                    MonitorFishMissionActionEntity(
                        id = 1,
                        actionDatetimeUtc = "2022-01-15T04:50:09Z",
                        actionType = MonitorFishActionTypeEnum.AIR_CONTROL,
                        completion = ActionCompletionEnum.COMPLETED,
                        missionId = 57,
                        numberOfVesselsFlownOver = 2,
                        vesselName = "vessel",
                        latitude = 40.7128,
                        longitude = -74.0060,
                        otherComments = "comments",
                    ),
                ),
            )

        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId))
            .willReturn(
                RapportNavMissionActionEntity(
                    id = 1,
                    containsActionsAddedByUnit = false,
                ),
            )

        val result =
            CanDeleteMission(
                missionRepository = missionRepository,
                monitorFishMissionActionsRepository =
                monitorFishMissionActionsRepository,
                rapportNavMissionActionsRepository = rapportNavMissionActionsRepository,
            )
                .execute(missionId, MissionSourceEnum.MONITORENV)

        assertThat(result).isEqualTo(CanDeleteMissionResponse(false, listOf(MissionSourceEnum.MONITORFISH)))
    }

    @Test
    fun `execute Should return a list when have Fish actions and RapportNav actions and request come from Env`() {
        val missionId = 53

        val wktReader = WKTReader()

        val multipolygonString =
            "MULTIPOLYGON(((-2.7335 47.6078, -2.7335 47.8452, -3.6297 47.8452, -3.6297 47.6078, -2.7335 47.6078)))"
        val polygon = wktReader.read(multipolygonString) as MultiPolygon
        val envActionControl =
            EnvActionControlEntity(
                id = UUID.fromString("33310163-4e22-4d3d-b585-dac4431eb4b5"),
                geom = polygon,
            )
        given(missionRepository.findById(missionId))
            .willReturn(
                MissionEntity(
                    id = 53,
                    missionTypes = listOf(MissionTypeEnum.LAND),
                    facade = "Outre-Mer",
                    geom = null,
                    startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                    endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                    isDeleted = false,
                    missionSource = MissionSourceEnum.MONITORENV,
                    hasMissionOrder = false,
                    isUnderJdp = false,
                    isGeometryComputedFromControls = false,
                    envActions = listOf(envActionControl),
                ),
            )

        given(monitorFishMissionActionsRepository.findFishMissionActionsById(missionId))
            .willReturn(
                listOf(
                    MonitorFishMissionActionEntity(
                        id = 1,
                        actionDatetimeUtc = "2022-01-15T04:50:09Z",
                        actionType = MonitorFishActionTypeEnum.AIR_CONTROL,
                        completion = ActionCompletionEnum.COMPLETED,
                        missionId = 57,
                        numberOfVesselsFlownOver = 2,
                        vesselName = "vessel",
                        latitude = 40.7128,
                        longitude = -74.0060,
                        otherComments = "comments",
                    ),
                ),
            )

        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId))
            .willReturn(
                RapportNavMissionActionEntity(
                    id = 1,
                    containsActionsAddedByUnit = true,
                ),
            )

        val result =
            CanDeleteMission(
                missionRepository = missionRepository,
                monitorFishMissionActionsRepository =
                monitorFishMissionActionsRepository,
                rapportNavMissionActionsRepository = rapportNavMissionActionsRepository,
            )
                .execute(missionId, MissionSourceEnum.MONITORENV)

        assertThat(result).isEqualTo(
            CanDeleteMissionResponse(false, listOf(MissionSourceEnum.MONITORFISH, MissionSourceEnum.RAPPORT_NAV)),
        )
    }
}
