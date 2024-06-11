package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
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
        val id = UUID.fromString("16eeb9e8-f30c-430e-b36b-32b4673f81ce")
        val today = ZonedDateTime.now(ZoneOffset.UTC)
        val tomorrow = ZonedDateTime.now(ZoneOffset.UTC).plusDays(1)

        val anEnvAction = anEnvAction(objectMapper, id, today, tomorrow)

        // When
        val envActionEntity = jpaEnvActionRepository.save(anEnvAction)

        // Then
        assertThat(envActionEntity).isEqualTo(anEnvAction)
    }
}
