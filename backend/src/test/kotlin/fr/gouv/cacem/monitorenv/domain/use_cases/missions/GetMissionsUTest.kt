package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class GetMissionsUTest {
    private val missionRepository: IMissionRepository = mock()
    private val getMissions = GetMissions(missionRepository)

    @Test
    fun `execute should return all missions`(log: CapturedOutput) {
        // Given
        val expectedMissions = listOf(MissionFixture.aMissionEntity())
        val startedAfter = ZonedDateTime.now()
        given(
            missionRepository.findAll(
                null,
                listOf(
                    MissionSourceEnum.MONITORENV,
                    MissionSourceEnum.MONITORFISH,
                ),
                null,
                null,
                null,
                null,
                null,
                startedAfter.toInstant(),
                null,
                null,
            ),
        ).willReturn(expectedMissions)

        // When
        val missions = getMissions.execute(startedAfterDateTime = startedAfter)

        // Then
        assertThat(missions).isEqualTo(expectedMissions)
        assertThat(log.out).contains("Attempt to GET all missions")
        assertThat(log.out).contains("Found ${missions.size} missions")
    }
}
