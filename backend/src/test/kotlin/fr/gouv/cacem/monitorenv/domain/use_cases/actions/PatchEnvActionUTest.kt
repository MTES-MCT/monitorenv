package fr.gouv.cacem.monitorenv.domain.use_cases.actions

import com.nhaarman.mockitokotlin2.given
import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.repositories.IEnvActionRepository
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.interactors.IDataMerger
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.mockito.Mockito.mock
import java.time.ZonedDateTime
import java.util.UUID

class PatchEnvActionUTest {

    private val envActionRepository: IEnvActionRepository = mock()
    private val mergeData: IDataMerger<EnvActionEntity> = mock()

    private val patchEnvAction: PatchEnvAction = PatchEnvAction(envActionRepository, mergeData)

    @Test
    fun `execute() should return the saved patched entity when it exists`() {
        // Given
        val id = UUID.randomUUID()
        val today = ZonedDateTime.now()
        val tomorrow = ZonedDateTime.now().plusDays(1)
        val partialEnvAction = anEnvAction(id, today, tomorrow)
        val envActionFromDatabase = anEnvAction(id, ZonedDateTime.now(), ZonedDateTime.now().plusDays(2))
        val envActionMerged = anEnvAction(envActionFromDatabase.id, today, tomorrow)

        given(envActionRepository.findById(id)).willReturn(envActionFromDatabase)
        given(mergeData.merge(envActionFromDatabase, partialEnvAction)).willReturn(envActionMerged)
        given(envActionRepository.save(envActionMerged)).willReturn(envActionMerged)

        // When
        val patchedEnvAction = patchEnvAction.execute(id, partialEnvAction)

        // Then
        assertThat(patchedEnvAction.actionStartDateTimeUtc).isEqualTo(partialEnvAction.actionStartDateTimeUtc)
        assertThat(patchedEnvAction.actionEndDateTimeUtc).isEqualTo(partialEnvAction.actionEndDateTimeUtc)
        verify(envActionRepository).save(envActionMerged)
    }

    @Test
    fun `execute() should throw BackendUsageException when the entity does not exist`() {
        // Given
        val id = UUID.randomUUID()
        val today = ZonedDateTime.now()
        val tomorrow = ZonedDateTime.now().plusDays(1)
        val partialEnvAction = anEnvAction(id, today, tomorrow)

        given(envActionRepository.findById(id)).willReturn(null)

        // When & Then
        assertThrows<BackendUsageException> { patchEnvAction.execute(id, partialEnvAction) }
    }
}
