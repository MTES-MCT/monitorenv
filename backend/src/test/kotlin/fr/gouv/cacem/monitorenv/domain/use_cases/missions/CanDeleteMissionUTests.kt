package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.CanDeleteMissionResponse
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MonitorFishActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mock
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import org.springframework.test.context.junit.jupiter.SpringExtension
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
            .willReturn(aMissionEntity())
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
            ).execute(missionId, MissionSourceEnum.MONITORFISH)

        assertThat(result).isEqualTo(CanDeleteMissionResponse(true, listOf()))
        assertThat(log.out).contains("Can mission $missionId be deleted")
    }

    @Test
    fun `execute Should return a list when have Env Actions but no RapportNav Actions and request come from Fish`(
        log: CapturedOutput,
    ) {
        val missionId = 34
        given(missionRepository.findById(missionId))
            .willReturn(
                aMissionEntity(
                    envActions =
                        listOf(
                            anEnvAction(
                                mapper = ObjectMapper(),
                                id = UUID.randomUUID(),
                            ),
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
            ).execute(missionId, MissionSourceEnum.MONITORFISH)

        assertThat(result).isEqualTo(CanDeleteMissionResponse(false, listOf(MissionSourceEnum.MONITORENV)))
        assertThat(log.out).contains("Can mission $missionId be deleted")
    }

    @Test
    fun `execute Should return a list when have Env actions and RapportNav actions and request come from Fish`() {
        val missionId = 53

        given(missionRepository.findById(missionId))
            .willReturn(
                aMissionEntity(
                    envActions =
                        listOf(
                            anEnvAction(
                                mapper = ObjectMapper(),
                                id = UUID.randomUUID(),
                            ),
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
            ).execute(missionId, MissionSourceEnum.MONITORFISH)

        assertThat(result).isEqualTo(
            CanDeleteMissionResponse(false, listOf(MissionSourceEnum.MONITORENV, MissionSourceEnum.RAPPORT_NAV)),
        )
    }

    @Test
    fun `execute Should return true when haven't actions from Fish and RapportNav and request come from Env`() {
        val missionId = 57

        given(missionRepository.findById(missionId))
            .willReturn(aMissionEntity())

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
            ).execute(missionId, MissionSourceEnum.MONITORENV)

        assertThat(result).isEqualTo(CanDeleteMissionResponse(true, listOf()))
    }

    @Test
    fun `execute Should return a list when have Fish Actions but no RapportNav Actions and request come from Env`() {
        val missionId = 57

        given(missionRepository.findById(missionId))
            .willReturn(aMissionEntity())

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
            ).execute(missionId, MissionSourceEnum.MONITORENV)

        assertThat(result).isEqualTo(CanDeleteMissionResponse(false, listOf(MissionSourceEnum.MONITORFISH)))
    }

    @Test
    fun `execute Should return a list when have Fish actions and RapportNav actions and request come from Env`() {
        val missionId = 53

        given(missionRepository.findById(missionId))
            .willReturn(aMissionEntity())

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
            ).execute(missionId, MissionSourceEnum.MONITORENV)

        assertThat(result).isEqualTo(
            CanDeleteMissionResponse(false, listOf(MissionSourceEnum.MONITORFISH, MissionSourceEnum.RAPPORT_NAV)),
        )
    }
}
