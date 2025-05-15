package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.times
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvActionControl
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.themes.fixtures.ThemeFixture.Companion.aTheme
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
        val expectedMissions = listOf(aMissionEntity())
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
        verify(missionRepository, times(0)).addLegacyControlPlans(missions[0])
        assertThat(log.out).contains("Attempt to GET all missions")
        assertThat(log.out).contains("Found ${missions.size} missions")
    }

    @Test
    fun `execute should return a list of missions with control plans`() {
        // Given
        val startedAfter = ZonedDateTime.now()
        val withLegacyControlPlans = true
        val expectedMissions =
            listOf(aMissionEntity(envActions = listOf(anEnvActionControl(themes = listOf(aTheme())))))
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
        val missions =
            getMissions.execute(startedAfterDateTime = startedAfter, withLegacyControlPlans = withLegacyControlPlans)

        // Then
        assertThat(missions).isEqualTo(expectedMissions)
        verify(missionRepository, times(1)).addLegacyControlPlans(missions[0])
    }
}
