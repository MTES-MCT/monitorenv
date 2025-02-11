package fr.gouv.cacem.monitorenv.domain.validators.mission

import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.ValueSource
import java.time.ZonedDateTime

class MissionValidatorUTest {
    private val missionValidator = MissionValidator()

    @Test
    fun `validate should throw an exception if startDateTimeUtc is after endDateTimeUtc`() {
        val startDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val mission =
            aMissionEntity(
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = startDateTimeUtc.minusSeconds(1),
            )

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.data).isEqualTo("La date de fin doit être postérieure à la date de début")
    }

    @Test
    fun `validate should throw an exception if controlUnits is empty`() {
        val mission = aMissionEntity(controlUnits = emptyList())

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.data).isEqualTo("Une unité de contrôle est requise")
    }

    @Test
    fun `validate should throw an exception if missionTypes is empty`() {
        val mission = aMissionEntity(missionTypes = emptyList())

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.data).isEqualTo("Le type de mission est requis")
    }

    @ParameterizedTest
    @ValueSource(strings = ["A", "AA", "AAAA"])
    fun `validate should throw an exception if openBy is not a trigram`(openBy: String) {
        val mission = aMissionEntity(openBy = openBy)

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.data).isEqualTo("Le trigramme \"ouvert par\" doit avoir 3 lettres")
    }

    @ParameterizedTest
    @ValueSource(strings = ["A", "AA", "AAAA"])
    fun `validate should throw an exception if completedBy is not a trigram`(completedBy: String) {
        val mission = aMissionEntity(completedBy = completedBy)

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.data).isEqualTo("Le trigramme \"complété par\" doit avoir 3 lettres")
    }

    @Test
    fun `validate should pass for a valid MissionEntity`() {
        val mission = aMissionEntity()

        missionValidator.validate(mission)
    }
}
