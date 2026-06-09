package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.mock
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missionTag.fixtures.MissionTagFixture.Companion.aMissionTagEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class SaveMissionTagMissionUTest {
    private val missionRepository: IMissionRepository = mock()
    private val saveMissionTagMission = SaveMissionTagMission(missionRepository)

    @Test
    fun `should save mission with mission tags and log it`(log: CapturedOutput) {
        // Given
        val mission = aMissionEntity(id = 1)
        val missionDetailsDTO = aMissionDetailsDTO(mission)
        val missionTags = listOf(aMissionTagEntity())
        given(missionRepository.save(mission = mission.copy(missionTags = missionTags))).willReturn(missionDetailsDTO)

        // When
        saveMissionTagMission.execute(mission = mission, missionTags = missionTags)

        // Then
        assertThat(log.out).contains("Attempt to CREATE or UPDATE mission 1 with mission tags [1]")
        assertThat(log.out).contains("Mission 1 with mission tags [1] created or updated")
    }
}
