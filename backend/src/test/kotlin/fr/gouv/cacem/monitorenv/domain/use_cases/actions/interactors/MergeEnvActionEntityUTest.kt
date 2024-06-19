package fr.gouv.cacem.monitorenv.domain.use_cases.actions.interactors

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.PatchableEnvActionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.Optional
import java.util.UUID

class MergeEnvActionEntityUTest {
    private val mergeEnvActionEntity = MergeEnvActionEntity()
    private val objectMapper = MapperConfiguration().objectMapper()

    @Test
    fun `execute() should return envAction with actionStartDateTimeUtc modified if its present`() {
        // Given
        val today = ZonedDateTime.now(ZoneOffset.UTC)

        val patchableEnvActionEntity = PatchableEnvActionEntity(Optional.of(today), null, null)
        val id = UUID.randomUUID()
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val envAction = EnvActionFixture.anEnvAction(objectMapper, id, startTime = yesterday, endTime = tomorrow)

        // When
        val mergedEnvAction = mergeEnvActionEntity.execute(envAction, patchableEnvActionEntity)

        // Then
        assertThat(mergedEnvAction.actionStartDateTimeUtc).isEqualTo(today)
    }

    @Test
    fun `execute() should return envAction with actionStartDateTimeUtc null if its empty`() {
        // Given
        val patchableEnvActionEntity = PatchableEnvActionEntity(Optional.empty(), null, null)
        val id = UUID.randomUUID()
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val envAction = EnvActionFixture.anEnvAction(objectMapper, id, startTime = yesterday, endTime = tomorrow)

        // When
        val mergedEnvAction = mergeEnvActionEntity.execute(envAction, patchableEnvActionEntity)

        // Then
        assertThat(mergedEnvAction.actionStartDateTimeUtc).isNull()
    }

    @Test
    fun `execute() should return envAction with actionEndDateTimeUtc modified if its present`() {
        // Given
        val today = ZonedDateTime.now(ZoneOffset.UTC)

        val patchableEnvActionEntity = PatchableEnvActionEntity(null, Optional.of(today), null)
        val id = UUID.randomUUID()
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val envAction = EnvActionFixture.anEnvAction(objectMapper, id, startTime = yesterday, endTime = tomorrow)

        // When
        val mergedEnvAction = mergeEnvActionEntity.execute(envAction, patchableEnvActionEntity)

        // Then
        assertThat(mergedEnvAction.actionEndDateTimeUtc).isEqualTo(today)
    }

    @Test
    fun `execute() should return envAction with actionEndDateTimeUtc null if its empty`() {
        // Given
        val patchableEnvActionEntity = PatchableEnvActionEntity(null, Optional.empty(), null)
        val id = UUID.randomUUID()
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val envAction = EnvActionFixture.anEnvAction(objectMapper, id, startTime = yesterday, endTime = tomorrow)

        // When
        val mergedEnvAction = mergeEnvActionEntity.execute(envAction, patchableEnvActionEntity)

        // Then
        assertThat(mergedEnvAction.actionEndDateTimeUtc).isNull()
    }

    @Test
    fun `execute() should return envAction with observationsByUnit modified if its present`() {
        // Given
        val observationsByUnit = "observationsByUnit"

        val patchableEnvActionEntity = PatchableEnvActionEntity(null, null, Optional.of(observationsByUnit))
        val id = UUID.randomUUID()
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val envAction = EnvActionFixture.anEnvAction(
            objectMapper,
            id,
            startTime = yesterday,
            endTime = tomorrow,
            observationsByUnit = "oldValue",
        )

        // When
        val mergedEnvAction = mergeEnvActionEntity.execute(envAction, patchableEnvActionEntity)

        // Then
        assertThat(mergedEnvAction.observationsByUnit).isEqualTo(observationsByUnit)
    }

    @Test
    fun `execute() should return envAction with observationsByUnit null if its empty`() {
        // Given
        val patchableEnvActionEntity = PatchableEnvActionEntity(null, null, Optional.empty())
        val id = UUID.randomUUID()
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val envAction = EnvActionFixture.anEnvAction(
            objectMapper,
            id,
            startTime = yesterday,
            endTime = tomorrow,
            observationsByUnit = "oldValue",
        )

        // When
        val mergedEnvAction = mergeEnvActionEntity.execute(envAction, patchableEnvActionEntity)

        // Then
        assertThat(mergedEnvAction.observationsByUnit).isNull()
    }

    @Test
    fun `execute() should return envAction with old values if its null`() {
        // Given
        val patchableEnvActionEntity = PatchableEnvActionEntity(null, null, null)
        val id = UUID.randomUUID()
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val envAction = EnvActionFixture.anEnvAction(
            objectMapper,
            id,
            startTime = yesterday,
            endTime = tomorrow,
            observationsByUnit = "oldValue",
        )

        // When
        val mergedEnvAction = mergeEnvActionEntity.execute(envAction, patchableEnvActionEntity)

        // Then
        assertThat(mergedEnvAction).isEqualTo(envAction)
    }

}
