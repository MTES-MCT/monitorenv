package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension

@ExtendWith(OutputCaptureExtension::class)
class GetMissionsByIdsUTest {
    private val missionRepository: IMissionRepository = mock()
    private val getMissionsByIds = GetMissionsByIds(missionRepository)

    @Test
    fun `execute should return a list of missions from its ids`(log: CapturedOutput) {
        // Given
        val ids = listOf(1, 2, 3)
        val expectedMissions =
            listOf(
                aMissionEntity(id = 1),
                aMissionEntity(id = 2),
                aMissionEntity(id = 3),
            )
        given(missionRepository.findByIds(ids)).willReturn(
            expectedMissions,
        )

        // When
        val missions = getMissionsByIds.execute(ids)

        // Then
        assertThat(missions).isEqualTo(expectedMissions)
        assertThat(log.out).contains("GET missions $ids")
    }
}
