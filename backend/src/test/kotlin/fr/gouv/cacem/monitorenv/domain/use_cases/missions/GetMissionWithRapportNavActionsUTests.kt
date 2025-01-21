package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IRapportNavMissionActionsRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetMissionWithRapportNavActionsUTests {
    private val getMission: GetMission = mock()

    private val rapportNavMissionActionsRepository: IRapportNavMissionActionsRepository = mock()

    private val getMissionWithRapportNavActions: GetMissionWithRapportNavActions =
        GetMissionWithRapportNavActions(getMission, rapportNavMissionActionsRepository)

    @Test
    fun `execute should return mission with rapportNavActions`(log: CapturedOutput) {
        val missionId = 10

        val missionEntity = aMissionEntity()
        val mission = MissionDetailsDTO(mission = missionEntity)
        val rapportNavActions =
            RapportNavMissionActionEntity(
                id = 1,
                containsActionsAddedByUnit = true,
            )

        given(getMission.execute(missionId)).willReturn(missionEntity)
        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)).willReturn(
            rapportNavActions,
        )

        val result = getMissionWithRapportNavActions.execute(missionId)

        assertThat(result).isEqualTo(mission.copy(hasRapportNavActions = rapportNavActions))
        assertThat(log.out).contains("GET mission $missionId with rapportNavActions")
    }

    @Test
    fun `execute should return mission with hasRapportNavActions null on exception`() {
        val missionId = 10

        val missionEntity = aMissionEntity()
        val mission = MissionDetailsDTO(mission = missionEntity)

        given(getMission.execute(missionId)).willReturn(missionEntity)
        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)).willThrow(
            RuntimeException::class.java,
        )

        val result = getMissionWithRapportNavActions.execute(missionId)

        assertThat(mission.copy(hasRapportNavActions = null)).isEqualTo(result)
    }

    @Test
    fun `execute should return mission with hasRapportNavActions false when no actions are found`() {
        val missionId = 10
        val missionEntity = aMissionEntity()
        val mission = MissionDetailsDTO(mission = missionEntity)

        val rapportNavActions =
            RapportNavMissionActionEntity(
                id = 1,
                containsActionsAddedByUnit = false,
            )

        given(getMission.execute(missionId)).willReturn(missionEntity)
        given(rapportNavMissionActionsRepository.findRapportNavMissionActionsById(missionId)).willReturn(
            rapportNavActions,
        )

        val result = getMissionWithRapportNavActions.execute(missionId)

        assertThat(mission.copy(hasRapportNavActions = rapportNavActions)).isEqualTo(result)
    }
}
