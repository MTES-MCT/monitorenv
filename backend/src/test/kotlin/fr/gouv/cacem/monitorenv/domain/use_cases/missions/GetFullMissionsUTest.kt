package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionListDTO
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.ZonedDateTime

@ExtendWith(OutputCaptureExtension::class)
class GetFullMissionsUTest {
    private val missionRepository: IMissionRepository = mock()
    private val getFullMission = GetFullMissions(missionRepository)

    @Test
    fun `execute should return all missions`(log: CapturedOutput) {
        // Given
        val expectedMissions = listOf(aMissionListDTO())
        val startedAfter = ZonedDateTime.now()
        given(
            missionRepository.findAllFullMissions(
                null,
                listOf(
                    MissionSourceEnum.MONITORENV,
                    MissionSourceEnum.MONITORFISH,
                    MissionSourceEnum.RAPPORT_NAV,
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
        val missions =
            getFullMission.execute(
                startedAfterDateTime = startedAfter,
                startedBeforeDateTime = null,
                missionTypes = null,
                missionStatuses = null,
                pageNumber = null,
                pageSize = null,
                seaFronts = null,
                searchQuery = null,
            )

        // Then
        assertThat(missions).isEqualTo(expectedMissions)
        assertThat(log.out).contains("Attempt to GET all full missions")
        assertThat(log.out).contains("Found ${missions.size} full mission(s)")
    }
}
