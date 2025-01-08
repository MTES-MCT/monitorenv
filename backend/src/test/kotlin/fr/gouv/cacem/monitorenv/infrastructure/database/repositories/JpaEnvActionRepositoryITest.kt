package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.UUID

class JpaEnvActionRepositoryITest : AbstractDBTests() {
    @Autowired
    private lateinit var jpaEnvActionRepository: JpaEnvActionRepository

    private val objectMapper: ObjectMapper = ObjectMapper()

    @Test
    fun `findById() should return the appropriate envAction`() {
        // Given
        val id = UUID.fromString("16eeb9e8-f30c-430e-b36b-32b4673f81ce")

        // When
        val envActionEntity = jpaEnvActionRepository.findById(id)

        // Then
        assertThat(envActionEntity).isNotNull()
        assertThat(envActionEntity?.id).isEqualTo(id)
    }

    @Test
    fun `findById() should return null when id does not exist`() {
        // Given
        val id = UUID.randomUUID()

        // When
        val envActionEntity = jpaEnvActionRepository.findById(id)

        // Then
        assertThat(envActionEntity).isNull()
    }

    @Test
    fun `save() should return the updated entity`() {
        // Given
        val id = UUID.fromString("e2257638-ddef-4611-960c-7675a3254c38")
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val observationsByUnit = "observationsByUnit"

        val anEnvAction =
            anEnvAction(
                objectMapper,
                id,
                today,
                tomorrow,
                observationsByUnit,
                missionId = 38,
                controlPlans =
                    listOf(
                        EnvActionControlPlanEntity(themeId = 11, subThemeIds = listOf(51), tagIds = listOf()),
                    ),
            )

        // When
        val envActionEntity = jpaEnvActionRepository.save(anEnvAction)

        // Then
        assertThat(envActionEntity).isEqualTo(anEnvAction)
        assertThat(envActionEntity.controlPlans?.size).isEqualTo(1)
    }

    @Test
    fun `save() should throws BackendUseException if missionId is not set`() {
        // Given
        val id = UUID.fromString("16eeb9e8-f30c-430e-b36b-32b4673f81ce")
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)
        val observationsByUnit = "observationsByUnit"

        val anEnvAction = anEnvAction(objectMapper, id, today, tomorrow, observationsByUnit, missionId = null)

        // When
        val backendUsageException = assertThrows<BackendUsageException> { jpaEnvActionRepository.save(anEnvAction) }

        // Then
        assertThat(backendUsageException.message).isEqualTo("Trying to save an envAction without mission")
    }
}
