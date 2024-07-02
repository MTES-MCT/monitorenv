package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMonitorFishMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.aMonitorFishAction
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.mockito.Mockito.mock

class GetFullMissionWithFishAndRapportNavActionsUTest {

    private val getFullMission: GetFullMission = mock()

    private val rapportNavMissionActionsRepository: IRapportNavMissionActionsRepository = mock()

    private val monitorFishMissionActionsRepository: IMonitorFishMissionActionsRepository = mock()

    private val getMissionWithFishAndRapportNavActions: GetMissionWithFishAndRapportNavActions =
        GetMissionWithFishAndRapportNavActions(
            getFullMission,
            monitorFishMissionActionsRepository,
            rapportNavMissionActionsRepository,
        )

    @Test
    fun `execute should return that api succeeded and a mission with fish and rapportnav information`() {
        // Given
        val missionId = 100

        val missionFromDatabase = MissionDTO(mission = MissionFixture.aMissionEntity())
        given(getFullMission.execute(missionId)).willReturn(missionFromDatabase)

        val fishActions = listOf(aMonitorFishAction(missionId))
        given(monitorFishMissionActionsRepository.findFishMissionActionsById(missionId)).willReturn(fishActions)
        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)).willReturn(
            RapportNavMissionActionEntity(1, true),
        )

        // When
        val fullMission = getMissionWithFishAndRapportNavActions.execute(missionId)

        // Then
        assertThat(fullMission.first).isTrue()
        assertThat(fullMission.second.mission).isEqualTo(missionFromDatabase.mission)
        assertThat(fullMission.second.fishActions).isEqualTo(fishActions)
        assertThat(fullMission.second.hasRapportNavActions?.containsActionsAddedByUnit).isEqualTo(true)
    }

    @Test
    fun `execute should return mission without fish and rapportnav information when something wrong happen during rapportNav api calls`() {
        // Given
        val missionId = 100

        val missionFromDatabase = MissionDTO(mission = MissionFixture.aMissionEntity())
        given(getFullMission.execute(missionId)).willReturn(missionFromDatabase)

        val fishActions = listOf(aMonitorFishAction(missionId))
        given(monitorFishMissionActionsRepository.findFishMissionActionsById(missionId)).willReturn(fishActions)
        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)).willThrow(RuntimeException::class.java)

        // When
        val fullMission = getMissionWithFishAndRapportNavActions.execute(missionId)

        // Then
        assertThat(fullMission.first).isFalse()
        assertThat(fullMission.second.mission).isEqualTo(missionFromDatabase.mission)
        assertThat(fullMission.second.fishActions).isEmpty()
        assertThat(fullMission.second.hasRapportNavActions).isNull()
    }

    @Test
    fun `execute should return mission without fish and rapportnav information when something wrong happen during fish api calls`() {
        // Given
        val missionId = 100

        val missionFromDatabase = MissionDTO(mission = MissionFixture.aMissionEntity())
        given(getFullMission.execute(missionId)).willReturn(missionFromDatabase)

        given(monitorFishMissionActionsRepository.findFishMissionActionsById(missionId)).willThrow(RuntimeException::class.java)

        // When
        val fullMission = getMissionWithFishAndRapportNavActions.execute(missionId)

        // Then
        assertThat(fullMission.first).isFalse()
        assertThat(fullMission.second.mission).isEqualTo(missionFromDatabase.mission)
        assertThat(fullMission.second.fishActions).isEmpty()
        assertThat(fullMission.second.hasRapportNavActions).isNull()
    }
}
