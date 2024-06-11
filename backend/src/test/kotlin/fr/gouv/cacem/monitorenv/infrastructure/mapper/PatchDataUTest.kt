package fr.gouv.cacem.monitorenv.infrastructure.mapper

import fr.gouv.cacem.monitorenv.config.MapperConfiguration
import fr.gouv.cacem.monitorenv.domain.entities.PatchableEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestErrorCode
import fr.gouv.cacem.monitorenv.infrastructure.exceptions.BackendRequestException
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.UUID

class PatchDataUTest {

    private val objectMapper = MapperConfiguration().objectMapper()

    private val patchData = PatchData<EnvActionEntity>(objectMapper)

    @Test
    fun `patch should override properties when setted`() {
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val partialEnvActionAsJson = """
            { "actionEndDateTimeUtc": "${tomorrow.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)}",
              "actionStartDateTimeUtc": "${today.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)}" }
        """.trimIndent()
        val jsonNode = objectMapper.readTree(partialEnvActionAsJson)
        val patchableEntity = PatchableEntity(jsonNode)
        val patched = patchData.execute(
            anEnvAction(
                objectMapper,
                UUID.randomUUID(),
                startTime = yesterday,
                endTime = today,
            ),
            patchableEntity,
            EnvActionEntity::class,
        )

        assertThat(patched.actionStartDateTimeUtc).isEqualTo(today)
        assertThat(patched.actionEndDateTimeUtc).isEqualTo(tomorrow)
    }

    @Test
    fun `patch should not override properties when not setted`() {
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val partialEnvActionAsJson = """
            { "actionEndDateTimeUtc": "${tomorrow.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)}" }
        """.trimIndent()
        val jsonNode = objectMapper.readTree(partialEnvActionAsJson)
        val patchableEntity = PatchableEntity(jsonNode)

        val patched = patchData.execute(
            anEnvAction(
                objectMapper,
                UUID.randomUUID(),
                startTime = yesterday,
                endTime = today,
            ),
            patchableEntity,
            EnvActionEntity::class,
        )

        assertThat(patched.actionStartDateTimeUtc).isEqualTo(yesterday)
        assertThat(patched.actionEndDateTimeUtc).isEqualTo(tomorrow)
    }

    @Test
    fun `patch should set null properties when is null`() {
        // Given
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val partialEnvActionAsJson = """
            { "actionEndDateTimeUtc": null }
        """.trimIndent()
        val jsonNode = objectMapper.readTree(partialEnvActionAsJson)
        val patchableEntity = PatchableEntity(jsonNode)

        // When
        val patched = patchData.execute(
            anEnvAction(
                objectMapper,
                UUID.randomUUID(),
                startTime = yesterday,
                endTime = today,
            ),
            patchableEntity,
            EnvActionEntity::class,
        )

        // Then
        assertThat(patched.actionStartDateTimeUtc).isEqualTo(yesterday)
        assertThat(patched.actionEndDateTimeUtc).isNull()
    }

    @Test
    fun `patch should throw an BackendRequestException when property doesnt exist on target entity`() {
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val partialEnvActionAsJson = """
            { "unknowproperty": null }
        """.trimIndent()
        val jsonNode = objectMapper.readTree(partialEnvActionAsJson)
        val patchableEntity = PatchableEntity(jsonNode)

        val exception = assertThrows<BackendRequestException> {
            patchData.execute(
                anEnvAction(
                    objectMapper,
                    UUID.randomUUID(),
                    startTime = yesterday,
                    endTime = today,
                ),
                patchableEntity,
                EnvActionEntity::class,
            )
        }
        assertThat(exception.code).isEqualTo(BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE)
        assertThat(exception.message).isEqualTo("Unknown or unpatchable property unknowproperty")
    }

    @Test
    fun `patch should throw an BackendRequestException when property has not @Patchable annotation on target entity`() {
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val partialEnvActionAsJson = """
            { "id": "${UUID.randomUUID()}" }
        """.trimIndent()
        val jsonNode = objectMapper.readTree(partialEnvActionAsJson)
        val patchableEntity = PatchableEntity(jsonNode)

        val exception = assertThrows<BackendRequestException> {
            patchData.execute(
                anEnvAction(
                    objectMapper,
                    UUID.randomUUID(),
                    startTime = yesterday,
                    endTime = today,
                ),
                patchableEntity,
                EnvActionEntity::class,
            )
        }
        assertThat(exception.code).isEqualTo(BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE)
        assertThat(exception.message).isEqualTo("Unknown or unpatchable property id")
    }

    @Test
    fun `patch should throw an BackendRequestException when property has wrong type`() {
        val yesterday = ZonedDateTime.now(ZoneOffset.UTC).minusDays(1)
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val partialEnvActionAsJson = """
            { "actionEndDateTimeUtc": "wrong type" }
        """.trimIndent()
        val jsonNode = objectMapper.readTree(partialEnvActionAsJson)
        val patchableEntity = PatchableEntity(jsonNode)

        val exception = assertThrows<BackendRequestException> {
            patchData.execute(
                anEnvAction(
                    objectMapper,
                    UUID.randomUUID(),
                    startTime = yesterday,
                    endTime = today,
                ),
                patchableEntity,
                EnvActionEntity::class,
            )
        }
        assertThat(exception.code).isEqualTo(BackendRequestErrorCode.WRONG_REQUEST_BODY_PROPERTY_TYPE)
        assertThat(exception.message).isNotNull()
    }
}
