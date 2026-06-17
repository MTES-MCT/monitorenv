package fr.gouv.cacem.monitorenv.domain.use_cases.missions

import com.nhaarman.mockitokotlin2.given
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.mappers.PatchEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IMissionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitFixture.Companion.aControlUnit
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.fixtures.ControlUnitResourceFixture.Companion.aControlUnitResource
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import fr.gouv.cacem.monitorenv.domain.validators.mission.MissionWithEnvActionsValidator
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import java.time.ZonedDateTime
import java.util.Optional
import kotlin.random.Random

@ExtendWith(OutputCaptureExtension::class)
class PatchMissionUTest {
    private val missionRepository: IMissionRepository = mock()
    private val missionWithEnvActionsValidator: MissionWithEnvActionsValidator = mock()
    private val patchEntity: PatchEntity<MissionEntity, PatchableMissionEntity> = PatchEntity()
    private val patchMission: PatchMission =
        PatchMission(missionRepository, patchEntity, missionWithEnvActionsValidator)

    @Test
    fun `execute() should validate then return the patched entity`(log: CapturedOutput) {
        // Given
        val inOrder = Mockito.inOrder(missionWithEnvActionsValidator, missionRepository)
        val id = Random.nextInt()
        val today = ZonedDateTime.now()
        val tomorrow = ZonedDateTime.now().plusDays(1)
        val patchedObservationsByUnit = "patched observations"
        val patchedIsUnderJdp = false
        val controlUnits = listOf(aControlUnit())
        val controlUnitResources = listOf(aControlUnitResource())
        val patchableMission =
            PatchableMissionEntity(
                controlUnits = controlUnits,
                controlResources = controlUnitResources,
                missionTypes = listOf(MissionTypeEnum.SEA),
                observationsByUnit = Optional.of(patchedObservationsByUnit),
                startDateTimeUtc = today,
                endDateTimeUtc = Optional.of(tomorrow),
                isUnderJdp = patchedIsUnderJdp,
            )
        val missionFromDatabase = aMissionEntity(id = id)
        val missionPatched =
            aMissionEntity(
                id = id,
                controlUnits = controlUnits,
                controlResources = controlUnitResources,
                observationsByUnit = patchedObservationsByUnit,
                startDateTimeUtc = today,
                endDateTimeUtc = tomorrow,
                isUnderJdp = patchedIsUnderJdp,
                missionTypes = listOf(MissionTypeEnum.SEA),
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
        assertThat(savedMission.mission.controlUnits).isEqualTo(missionPatched.controlUnits)
        assertThat(savedMission.mission.missionTypes).isEqualTo(missionPatched.missionTypes)
        inOrder.verify(missionWithEnvActionsValidator).validate(missionPatched)
        inOrder.verify(missionRepository).save(missionPatched)
        assertThat(log.out).contains("Attempt to PATCH mission $id")
        assertThat(log.out).contains("Mission $id patched")
    }

    @Test
    fun `execute() should throw BackendUsageException with message when the entity does not exist`() {
        // Given
        val id = Random.nextInt()
        val patchableMission =
            PatchableMissionEntity(
                controlUnits = null,
                controlResources = null,
                missionTypes = null,
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
