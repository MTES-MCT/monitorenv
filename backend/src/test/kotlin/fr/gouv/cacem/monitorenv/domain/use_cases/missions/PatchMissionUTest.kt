package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.mappers.PatchEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.ZonedDateTime
import java.util.*
import kotlin.random.Random

@ExtendWith(OutputCaptureExtension::class)
class PatchMissionUTest {
    private val missionRepository: IMissionRepository = mock()
    private val patchEntity: PatchEntity<MissionEntity, PatchableMissionEntity> = PatchEntity()
    private val patchMission: PatchMission = PatchMission(missionRepository, patchEntity)

    @Test
    fun `execute() should return the patched entity`(log: CapturedOutput) {
        // Given
        val id = Random.nextInt()
        val today = ZonedDateTime.now()
        val tomorrow = ZonedDateTime.now().plusDays(1)
        val patchedObservationsByUnit = "patched observations"
        val patchedIsUnderJdp = false
        val patchableMission =
            PatchableMissionEntity(
                observationsByUnit = Optional.of(patchedObservationsByUnit),
                startDateTimeUtc = today,
                endDateTimeUtc = Optional.of(tomorrow),
                isUnderJdp = patchedIsUnderJdp,
            )
        val missionFromDatabase = aMissionEntity(id = id)
        val missionPatched =
            aMissionEntity(
                id = id,
                observationsByUnit = patchedObservationsByUnit,
                startDateTimeUtc = today,
                endDateTimeUtc = tomorrow,
                isUnderJdp = patchedIsUnderJdp,
            )

        given(missionRepository.findById(id)).willReturn(missionFromDatabase)
        given(missionRepository.save(missionPatched)).willReturn(MissionDetailsDTO(missionPatched))

        // When
        val savedMission = patchMission.execute(id, patchableMission)

        // Then
        assertThat(savedMission.mission.observationsByUnit).isEqualTo(missionPatched.observationsByUnit)
        assertThat(savedMission.mission.startDateTimeUtc).isEqualTo(missionPatched.startDateTimeUtc)
        assertThat(savedMission.mission.endDateTimeUtc).isEqualTo(missionPatched.endDateTimeUtc)
        assertThat(savedMission.mission.isUnderJdp).isEqualTo(missionPatched.isUnderJdp)
        verify(missionRepository).save(missionPatched)
        assertThat(log.out).contains("Attempt to PATCH mission $id")
        assertThat(log.out).contains("Mission $id patched")
    }

    @Test
    fun `execute() should throw BackendUsageException with message when the entity does not exist`() {
        // Given
        val id = Random.nextInt()
        val patchableMission =
            PatchableMissionEntity(
                observationsByUnit = null,
                startDateTimeUtc = null,
                endDateTimeUtc = null,
                isUnderJdp = null,
            )

        given(missionRepository.findById(id)).willReturn(null)

        // When & Then
        val exception =
            assertThrows<BackendUsageException> { patchMission.execute(id, patchableMission) }

        assertThat(exception.message).isEqualTo("Mission $id not found")
    }
}
