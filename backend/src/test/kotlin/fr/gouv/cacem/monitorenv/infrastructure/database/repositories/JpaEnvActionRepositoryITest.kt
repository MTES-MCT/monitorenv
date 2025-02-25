package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.config.CustomQueryCountListener
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.beans.factory.annotation.Autowired
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.*

class JpaEnvActionRepositoryITest : AbstractDBTests() {
    @Autowired
    private val customQueryCountListener: CustomQueryCountListener? = null

    @Autowired
    private lateinit var jpaEnvActionRepository: JpaEnvActionRepository

    private val objectMapper: ObjectMapper = ObjectMapper()

    @BeforeEach
    fun setUp() {
        customQueryCountListener!!.resetQueryCount() // Reset the count before each test
    }

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

    @Test
    fun `getRecentControlsActivity() should return the appropriate envActions`() {
        // When
        val recentControlsActivity =
            jpaEnvActionRepository.getRecentControlsActivity(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2050-08-08T23:59:00Z").toInstant(),
                infractionsStatus = null,
                controlUnitIds = null,
                // administrationIds = null,
            )

        // Then
        assertThat(recentControlsActivity.size).isEqualTo(4)

        val queryCount = customQueryCountListener!!.getQueryCount()
        println("Number of Queries Executed: $queryCount")
    }

    @Test
    fun `getRecentControlsActivity() should return envActions when infractionsStatus is set with 'with infractions'`() {
        // When
        val recentControlsActivity =
            jpaEnvActionRepository.getRecentControlsActivity(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2050-08-08T00:00:00Z").toInstant(),
                infractionsStatus = listOf("WITH_INFRACTIONS"),
                controlUnitIds = null,
                administrationIds = null,
            )

        // Then
        assertThat(recentControlsActivity.size).isEqualTo(2)
    }

    @Test
    fun `getRecentControlsActivity() should return envActions when infractionsStatus is set with 'without infractions'`() {
        // When
        val recentControlsActivity =
            jpaEnvActionRepository.getRecentControlsActivity(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2050-08-08T00:00:00Z").toInstant(),
                infractionsStatus = listOf("WITHOUT_INFRACTIONS"),
                controlUnitIds = null,
                administrationIds = null,
            )
        // Then
        assertThat(recentControlsActivity.size).isEqualTo(2)
    }

    @Test
    fun `getRecentControlsActivity() should return envActions when controlUnitIds filter is set`() {
        // When
        val recentControlsActivity =
            jpaEnvActionRepository.getRecentControlsActivity(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2050-08-08T00:00:00Z").toInstant(),
                infractionsStatus = null,
                controlUnitIds = listOf(10002),
                administrationIds = null,
            )
        // Then
        assertThat(recentControlsActivity.size).isEqualTo(1)
    }

    @Test
    fun `getRecentControlsActivity() should return envActions when administrationIds filter is set`() {
        // When
        val recentControlsActivity =
            jpaEnvActionRepository.getRecentControlsActivity(
                startedAfter = ZonedDateTime.parse("2022-01-01T10:54:00Z").toInstant(),
                startedBefore = ZonedDateTime.parse("2050-08-08T00:00:00Z").toInstant(),
                infractionsStatus = null,
                controlUnitIds = null,
                administrationIds = listOf(1005),
            )
        // Then
        assertThat(recentControlsActivity.size).isEqualTo(2)
    }
}
