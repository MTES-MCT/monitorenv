package fr.gouv.cacem.monitorenv.domain.use_cases.actions

import com.fasterxml.jackson.databind.ObjectMapper
import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.PatchableEnvActionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.interactors.MergeEnvActionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.mock
import java.time.ZonedDateTime
import java.util.UUID

class PatchEnvActionUTest {

    private val envActionRepository: IEnvActionRepository = mock()
    private val mergeEnvActionEntity: MergeEnvActionEntity = mock()
    private val patchEnvAction: PatchEnvAction = PatchEnvAction(envActionRepository, mergeEnvActionEntity)
    private val objectMapper: ObjectMapper = ObjectMapper()

    @Test
    fun `execute() should return the patched entity`() {
        // Given
        val id = UUID.randomUUID()
        val today = ZonedDateTime.now()
        val tomorrow = ZonedDateTime.now().plusDays(1)
        val observationsByUnit = "observations"
        val patchedObservationsByUnit = "patched observations"
        val patchableEnvActionEntity = PatchableEnvActionEntity(null, null, null)
        val envActionFromDatabase = anEnvAction(
            objectMapper,
            id,
            ZonedDateTime.now(),
            ZonedDateTime.now().plusDays(2),
            observationsByUnit,
        )
        val envActionPatched =
            anEnvAction(objectMapper, envActionFromDatabase.id, today, tomorrow, patchedObservationsByUnit)

        given(envActionRepository.findById(id)).willReturn(envActionFromDatabase)
        given(mergeEnvActionEntity.execute(envActionFromDatabase, patchableEnvActionEntity)).willReturn(
            envActionPatched,
        )
        given(envActionRepository.save(envActionPatched)).willReturn(envActionPatched)

        // When
        val savedEnvAction = patchEnvAction.execute(id, patchableEnvActionEntity)

        // Then
        assertThat(savedEnvAction.actionStartDateTimeUtc).isEqualTo(envActionPatched.actionStartDateTimeUtc)
        assertThat(savedEnvAction.actionEndDateTimeUtc).isEqualTo(envActionPatched.actionEndDateTimeUtc)
        assertThat(savedEnvAction.observationsByUnit).isEqualTo(envActionPatched.observationsByUnit)
        verify(envActionRepository).save(envActionPatched)
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
