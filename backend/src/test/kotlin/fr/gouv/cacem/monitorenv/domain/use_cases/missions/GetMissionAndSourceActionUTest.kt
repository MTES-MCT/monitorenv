package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.aMonitorFishAction
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.mockito.Mockito.verifyNoInteractions
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import kotlin.random.Random

@ExtendWith(OutputCaptureExtension::class)
class GetMissionAndSourceActionUTest {
    private val getMission: GetMission = mock()

    private val apiFishMissionActionsRepository: IMonitorFishMissionActionsRepository = mock()

    private val apiRapportNavMissionActionsRepository: IRapportNavMissionActionsRepository = mock()

    private val getMissionAndSourceAction: GetMissionAndSourceAction =
        GetMissionAndSourceAction(getMission, apiFishMissionActionsRepository, apiRapportNavMissionActionsRepository)

    @Test
    fun `execute should return only the mission if source is not MONITORFISH or RAPPORTNAV`(log: CapturedOutput) {
        // Given
        val missionId = Random.nextInt()
        val source = null
        val missionFromDatabase = aMissionEntity()
        given(getMission.execute(missionId)).willReturn(missionFromDatabase)

        // When & Then
        val mission = getMissionAndSourceAction.execute(missionId, source)

        // Then
        verifyNoInteractions(apiFishMissionActionsRepository)
        verifyNoInteractions(apiRapportNavMissionActionsRepository)
        assertThat(mission.mission).isEqualTo(missionFromDatabase)
        assertThat(mission.fishActions).isEmpty()
        assertThat(mission.hasRapportNavActions).isNull()

        assertThat(log.out).contains("GET mission $missionId and source action")
    }

    @Test
    fun `execute should return mission with rapportNav action information when source is MONITORFISH `() {
        // Given
        val missionId = Random.nextInt()
        val source = MissionSourceEnum.MONITORFISH

        val missionFromDatabase = aMissionEntity()
        given(getMission.execute(missionId)).willReturn(missionFromDatabase)
        given(apiRapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)).willReturn(
            RapportNavMissionActionEntity(1, true),
        )

        // When
        val mission = getMissionAndSourceAction.execute(missionId, source)

        // Then
        verifyNoInteractions(apiFishMissionActionsRepository)
        assertThat(mission.hasRapportNavActions?.containsActionsAddedByUnit).isTrue()
        assertThat(mission.mission).isEqualTo(missionFromDatabase)
    }

    @Test
    fun `execute should return mission with fish action when source is RAPPORTNAV `() {
        // Given
        val missionId = Random.nextInt()
        val source = MissionSourceEnum.RAPPORT_NAV

        val missionFromDatabase = aMissionEntity()
        given(getMission.execute(missionId)).willReturn(missionFromDatabase)
        val fishActions = listOf(aMonitorFishAction(missionId))

        given(apiFishMissionActionsRepository.findFishMissionActionsById(missionId)).willReturn(fishActions)

        // When
        val mission = getMissionAndSourceAction.execute(missionId, source)

        // Then
        verifyNoInteractions(apiRapportNavMissionActionsRepository)
        assertThat(mission.fishActions).isEqualTo(fishActions)
        assertThat(mission.mission).isEqualTo(missionFromDatabase)
    }
}
