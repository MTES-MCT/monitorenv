package fr.gouv.cacem.monitorenv.domain.use_cases.actions

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.PatchableEnvActionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.mappers.PatchEntity
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.Mockito.mock
import org.springframework.boot.test.system.CapturedOutput
import org.springframework.boot.test.system.OutputCaptureExtension
import tools.jackson.databind.json.JsonMapper
import java.time.ZonedDateTime
import java.util.Optional
import java.util.UUID

@ExtendWith(OutputCaptureExtension::class)
class PatchEnvActionUTest {
    private val envActionRepository: IEnvActionRepository = mock()
    private val patchEntity: PatchEntity<EnvActionEntity, PatchableEnvActionEntity> = PatchEntity()
    private val patchEnvAction: PatchEnvAction = PatchEnvAction(envActionRepository, patchEntity)
    private val jsonMapper: JsonMapper = JsonMapper()

    @Test
    fun `execute() should return the patched entity`(log: CapturedOutput) {
        // Given
        val id = UUID.randomUUID()
        val today = ZonedDateTime.now()
        val tomorrow = ZonedDateTime.now().plusDays(1)
        val observationsByUnit = "observations"
        val patchedObservationsByUnit = "patched observations"
        val patchableEnvActionEntity =
            PatchableEnvActionEntity(
                Optional.of(today),
                Optional.of(tomorrow),
                Optional.of(patchedObservationsByUnit),
            )
        val envActionFromDatabase =
            anEnvAction(
                jsonMapper,
                id,
                ZonedDateTime.now(),
                ZonedDateTime.now().plusDays(2),
                observationsByUnit,
            )
        val envActionPatched =
            anEnvAction(jsonMapper, envActionFromDatabase.id, today, tomorrow, patchedObservationsByUnit)

        given(envActionRepository.findById(id)).willReturn(envActionFromDatabase)
        patchEntity.execute(envActionFromDatabase, patchableEnvActionEntity)
        given(envActionRepository.save(envActionPatched)).willReturn(envActionPatched)

        // When
        val savedEnvAction = patchEnvAction.execute(id, patchableEnvActionEntity)

        // Then
        assertThat(savedEnvAction.actionStartDateTimeUtc).isEqualTo(envActionPatched.actionStartDateTimeUtc)
        assertThat(savedEnvAction.actionEndDateTimeUtc).isEqualTo(envActionPatched.actionEndDateTimeUtc)
        assertThat(savedEnvAction.observationsByUnit).isEqualTo(envActionPatched.observationsByUnit)
        verify(envActionRepository).save(envActionPatched)
        assertThat(log.out).contains("Attempt to PATCH envaction $id")
        assertThat(log.out).contains("envaction $id patched")
    }

    @Test
    fun `execute() should throw BackendUsageException with message when the entity does not exist`() {
        // Given
        val id = UUID.randomUUID()
        val patchableEnvActionEntity = PatchableEnvActionEntity(null, null, null)

        given(envActionRepository.findById(id)).willReturn(null)

        // When & Then
        val exception =
            assertThrows<BackendUsageException> { patchEnvAction.execute(id, patchableEnvActionEntity) }

        assertThat(exception.message).isEqualTo("envAction $id not found")
    }
}
