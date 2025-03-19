package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageErrorCode
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import kotlin.random.Random

@ExtendWith(OutputCaptureExtension::class)
class GetMissionUTest {
    private val missionRepository: IMissionRepository = mock()
    private val getMission: GetMission = GetMission(missionRepository)

    @Test
    fun `execute should throw a BackendUsageException when mission doesnt exist`() {
        // Given
        val missionId = Random.nextInt()
        given(missionRepository.findById(missionId)).willReturn(null)

        // When
        val backendUsageException =
            org.junit.jupiter.api
                .assertThrows<BackendUsageException> { getMission.execute(missionId) }

        // Then
        assertThat(backendUsageException.code).isEqualTo(BackendUsageErrorCode.ENTITY_NOT_FOUND)
        assertThat(backendUsageException.message).isEqualTo("mission $missionId not found")
    }

    @Test
    fun `execute should return a mission`(log: CapturedOutput) {
        // Given
        val missionId = Random.nextInt()
        val missionFromDatabase = aMissionEntity()
        given(missionRepository.findById(missionId)).willReturn(missionFromDatabase)

        // When
        val mission = getMission.execute(missionId)

        // Then
        assertThat(mission).isEqualTo(missionFromDatabase)
        assertThat(log.out).contains("GET mission $missionId")
    }
}
