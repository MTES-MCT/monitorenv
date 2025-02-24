package fr.gouv.cacem.monitorenv.infrastructure.database.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvAction
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.endpoints.bff.v1.TestUtils
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.locationtech.jts.geom.Point
import org.locationtech.jts.io.WKTReader
import org.springframework.beans.factory.annotation.Autowired
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.util.*

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

    @Test
    fun `getRecentControlsActivity() should return the appropriate envActions`() {
        // Given
        val point = WKTReader().read("POINT (-4.54877816747593 48.305559876971)") as Point

        val controls =
            RecentControlsActivityListDTO(
                id = UUID.fromString("d0f5f3a0-0b1a-4b0e-9b0a-0b0b0b0b0b0b"),
                actionStartDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                themesIds = listOf(1),
                subThemesIds = listOf(1, 2),
                geom = point,
                facade = "Outre-Mer",
                department = "29",
                missionId = 1,
                observations = "Observations de l'action de contrôle",
                actionNumberOfControls = 2,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VEHICLE_LAND,
                infractions = TestUtils.getControlInfraction(),
                administrationIds = listOf(1),
                controlUnitsIds = listOf(1, 2),
            )
        // When
        val recentControlsActivity = jpaEnvActionRepository.getRecentControlsActivity()

        // Then
        assertThat(recentControlsActivity).contains(controls)
    }
}
