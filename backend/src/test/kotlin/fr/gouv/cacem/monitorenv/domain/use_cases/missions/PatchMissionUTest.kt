package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.mappers.PatchEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.mock
import java.util.*
import kotlin.random.Random

class PatchMissionUTest {

    private val missionRepository: IMissionRepository = mock()
    private val patchEntity: PatchEntity<MissionEntity, PatchableMissionEntity> = mock()
    private val patchMission: PatchMission = PatchMission(missionRepository, patchEntity)

    @Test
    fun `execute() should return the patched entity`() {
        // Given
        val id = Random.nextInt()
        val observationsByUnit = Optional.of("observations")
        val patchedObservationsByUnit = "patched observations"
        val patchableMission = PatchableMissionEntity(
            observationsByUnit = observationsByUnit,
            startDateTimeUtc = null,
            endDateTimeUtc = null
        )
        val missionFromDatabase = aMissionEntity()
        val missionPatched = aMissionEntity(observationsByUnit = patchedObservationsByUnit)

        given(missionRepository.findById(id)).willReturn(missionFromDatabase)
        given(patchEntity.execute(missionFromDatabase, patchableMission)).willReturn(
            missionPatched,
        )
        given(missionRepository.save(missionPatched)).willReturn(MissionDTO(missionPatched))

        // When
        val savedMission = patchMission.execute(id, patchableMission)

        // Then
        assertThat(savedMission.mission.observationsByUnit).isEqualTo(missionPatched.observationsByUnit)
        verify(missionRepository).save(missionPatched)
    }

    @Test
    fun `execute() should throw BackendUsageException with message when the entity does not exist`() {
        // Given
        val id = Random.nextInt()
        val patchableMission = PatchableMissionEntity(
            observationsByUnit = null,
            startDateTimeUtc = null,
            endDateTimeUtc = null
        )

        given(missionRepository.findById(id)).willReturn(null)

        // When & Then
        val exception =
            assertThrows<BackendUsageException> { patchMission.execute(id, patchableMission) }

        assertThat(exception.message).isEqualTo("mission $id not found")
    }
}
