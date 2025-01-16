package fr.gouv.cacem.monitorenv.domain.validators.mission

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvActionControl
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvActionSurveillance
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anInfraction
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource
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
        assertThat(assertThrows.message).isEqualTo("La date de fin doit être postérieure à la date de début")
    }

    @Test
    fun `validate should throw an exception if controlUnits is empty`() {
        val mission = aMissionEntity(controlUnits = emptyList())

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.message).isEqualTo("Une unité de contrôle est requise")
    }

    @Test
    fun `validate should throw an exception if missionTypes is empty`() {
        val mission = aMissionEntity(missionTypes = emptyList())

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.message).isEqualTo("Le type de mission est requis")
    }

    @ParameterizedTest
    @ValueSource(strings = ["A", "AA", "AAAA"])
    fun `validate should throw an exception if openBy is not a trigram`(openBy: String) {
        val mission = aMissionEntity(openBy = openBy)

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.message).isEqualTo("Le trigramme \"ouvert par\" doit avoir 3 lettres")
    }

    @ParameterizedTest
    @ValueSource(strings = ["A", "AA", "AAAA"])
    fun `validate should throw an exception if completedBy is not a trigram`(completedBy: String) {
        val mission = aMissionEntity(completedBy = completedBy)

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.message).isEqualTo("Le trigramme \"complété par\" doit avoir 3 lettres")
    }

    @Test
    fun `validate should throw an exception if there is a control with a start date before mission starting date`() {
        val startDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val anEnvActionControl = anEnvActionControl(startTime = startDateTimeUtc.minusSeconds(1))
        val mission = aMissionEntity(startDateTimeUtc = startDateTimeUtc, envActions = listOf(anEnvActionControl))

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(
            assertThrows.message,
        ).isEqualTo("La date de début du contrôle doit être postérieure à celle du début de mission")
    }

    @Test
    fun `validate should throw an exception if there is a control with a start date after mission ending date`() {
        val startDateTimeUtc = ZonedDateTime.parse("2019-03-04T00:00:00.000Z")
        val endDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val anEnvActionControl = anEnvActionControl(endTime = endDateTimeUtc.plusSeconds(1))
        val mission =
            aMissionEntity(
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
                envActions = listOf(anEnvActionControl),
            )

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(
            assertThrows.message,
        ).isEqualTo("La date de fin du contrôle doit être antérieure à celle de fin de mission")
    }

    @Test
    fun `validate should throw an exception if there is a control with an end date after mission ending date`() {
        val startDateTimeUtc = ZonedDateTime.parse("2019-03-04T00:00:00.000Z")
        val endDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val anEnvActionControl = anEnvActionControl(endTime = endDateTimeUtc.plusSeconds(1))
        val mission =
            aMissionEntity(
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
                envActions = listOf(anEnvActionControl),
            )

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(
            assertThrows.message,
        ).isEqualTo("La date de fin du contrôle doit être antérieure à celle de fin de mission")
    }

    @Test
    fun `validate should throw an exception if there is a control with an end date before mission starting date`() {
        val startDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val endDateTimeUtc = ZonedDateTime.parse("2021-03-04T00:00:00.000Z")

        val anEnvActionControl = anEnvActionControl(endTime = startDateTimeUtc.minusSeconds(1))
        val mission =
            aMissionEntity(
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
                envActions = listOf(anEnvActionControl),
            )

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(
            assertThrows.message,
        ).isEqualTo("La date de fin du contrôle doit être postérieure à celle du début de mission")
    }

    @Test
    fun `validate should pass if there is a control with an date equal to mission's`() {
        val startDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val endDateTimeUtc = ZonedDateTime.parse("2021-03-04T00:00:00.000Z")
        val anEnvActionControl = anEnvActionControl(startTime = startDateTimeUtc, endTime = endDateTimeUtc)
        val mission =
            aMissionEntity(
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
                envActions = listOf(anEnvActionControl),
            )

        missionValidator.validate(mission)
    }

    @ParameterizedTest
    @EnumSource(value = InfractionTypeEnum::class, names = ["WAITING"], mode = EnumSource.Mode.EXCLUDE)
    fun `validate should throw an exception if there is a control with infractionType other than WAITING that doesnt have a NATINF`(
        infractionType: InfractionTypeEnum,
    ) {
        val anEnvActionControl = anEnvActionControl(infractions = listOf(anInfraction(infractionType = infractionType)))
        val mission = aMissionEntity(envActions = listOf(anEnvActionControl))

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(
            assertThrows.message,
        ).isEqualTo("Une infraction doit avoir une natinf si le type d'infraction n'est pas \"En attente\"")
    }

    @Test
    fun `validate should throw an exception if there is a control with infraction and nbTarget is less than 1`() {
        val anEnvActionControl = anEnvActionControl(infractions = listOf(anInfraction(nbTarget = 0)))
        val mission = aMissionEntity(envActions = listOf(anEnvActionControl))

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.message).isEqualTo("le nombre minimum de cible est 1")
    }

    @Test
    fun `validate should throw an exception if there is a control with infractions that got more nbTarget than the mission actionNumberOfControls `() {
        val anEnvActionControl =
            anEnvActionControl(
                actionNumberOfControls = 10,
                infractions = listOf(anInfraction(nbTarget = 10), anInfraction(nbTarget = 5)),
            )
        val mission = aMissionEntity(envActions = listOf(anEnvActionControl))

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.message).isEqualTo("Le nombre de cibles excède le nombre total de contrôles")
    }

    @Test
    fun `validate should pass if there is a control with infractions that got less nbTarget than the mission actionNumberOfControls `() {
        val anEnvActionControl =
            anEnvActionControl(
                actionNumberOfControls = 2,
                infractions = listOf(anInfraction(nbTarget = 1)),
            )
        val mission = aMissionEntity(envActions = listOf(anEnvActionControl))

        missionValidator.validate(mission)
    }

    @Test
    fun `validate should pass if there is a control with infractionType = WAITING that doesnt have a NATINF`() {
        val anEnvActionControl =
            anEnvActionControl(infractions = listOf(anInfraction(infractionType = InfractionTypeEnum.WAITING)))
        val mission = aMissionEntity(envActions = listOf(anEnvActionControl))

        missionValidator.validate(mission)
    }

    @ParameterizedTest
    @ValueSource(strings = ["A", "AA", "AAAA"])
    fun `validate should throw an exception if there is a control with openBy is not a trigram`(openBy: String) {
        val anEnvActionControl = anEnvActionControl(openBy = openBy)
        val mission = aMissionEntity(envActions = listOf(anEnvActionControl))

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.message).isEqualTo("Le trigramme \"ouvert par\" doit avoir 3 lettres")
    }

    @Test
    fun `validate should throw an exception if there is a control actionTargetType as VEHICULE without vehiculeType when mission has ended`() {
        val endDateTimeUtc = ZonedDateTime.now().plusSeconds(1)
        val anEnvActionControl = anEnvActionControl(actionTargetTypeEnum = ActionTargetTypeEnum.VEHICLE)
        val mission = aMissionEntity(endDateTimeUtc = endDateTimeUtc, envActions = listOf(anEnvActionControl))

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(assertThrows.message).isEqualTo("Le type de véhicule est obligatoire")
    }

    @ParameterizedTest
    @EnumSource(value = ActionTargetTypeEnum::class, names = ["VEHICLE"], mode = EnumSource.Mode.EXCLUDE)
    fun `validate should pass if there is a control actionTargetType as targetType other than VEHICLE without vehiculeType when mission has ended`(
        targetType: ActionTargetTypeEnum,
    ) {
        val endDateTimeUtc = ZonedDateTime.now().plusSeconds(1)
        val anEnvActionControl = anEnvActionControl(actionTargetTypeEnum = targetType)
        val mission = aMissionEntity(endDateTimeUtc = endDateTimeUtc, envActions = listOf(anEnvActionControl))

        missionValidator.validate(mission)
    }

    @Test
    fun `validate should throw an exception if there is a surveillance with a start date before mission starting date`() {
        val startDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val anEnvActionSurveillance = anEnvActionSurveillance(startTime = startDateTimeUtc.minusSeconds(1))
        val mission = aMissionEntity(startDateTimeUtc = startDateTimeUtc, envActions = listOf(anEnvActionSurveillance))

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(
            assertThrows.message,
        ).isEqualTo("La date de début de la surveillance doit être postérieure à celle du début de mission")
    }

    @Test
    fun `validate should throw an exception if there is a surveillance with a start date after mission ending date`() {
        val startDateTimeUtc = ZonedDateTime.parse("2019-03-04T00:00:00.000Z")
        val endDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val anEnvActionSurveillance = anEnvActionSurveillance(endTime = endDateTimeUtc.plusSeconds(1))
        val mission =
            aMissionEntity(
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
                envActions = listOf(anEnvActionSurveillance),
            )

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(
            assertThrows.message,
        ).isEqualTo("La date de fin de la surveillance doit être antérieure à celle de fin de mission")
    }

    @Test
    fun `validate should throw an exception if there is a surveillance with an end date after mission ending date`() {
        val startDateTimeUtc = ZonedDateTime.parse("2019-03-04T00:00:00.000Z")
        val endDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val anEnvActionSurveillance = anEnvActionSurveillance(endTime = endDateTimeUtc.plusSeconds(1))
        val mission =
            aMissionEntity(
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
                envActions = listOf(anEnvActionSurveillance),
            )

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(
            assertThrows.message,
        ).isEqualTo("La date de fin de la surveillance doit être antérieure à celle de fin de mission")
    }

    @Test
    fun `validate should throw an exception if there is a surveillance with an end date before mission starting date`() {
        val startDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val endDateTimeUtc = ZonedDateTime.parse("2021-03-04T00:00:00.000Z")

        val anEnvActionSurveillance = anEnvActionSurveillance(endTime = startDateTimeUtc.minusSeconds(1))
        val mission =
            aMissionEntity(
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
                envActions = listOf(anEnvActionSurveillance),
            )

        val assertThrows = assertThrows(BackendUsageException::class.java) { missionValidator.validate(mission) }
        assertThat(
            assertThrows.message,
        ).isEqualTo("La date de fin de la surveillance doit être postérieure à celle du début de mission")
    }

    @Test
    fun `validate should pass if there is a surveillance with an date equal to mission's`() {
        val startDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val endDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val anEnvActionSurveillance = anEnvActionSurveillance(startTime = startDateTimeUtc, endTime = endDateTimeUtc)
        val mission =
            aMissionEntity(
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
                envActions = listOf(anEnvActionSurveillance),
            )

        missionValidator.validate(mission)
    }

    @Test
    fun `validate should pass for a valid MissionEntity`() {
        val mission = aMissionEntity()

        missionValidator.validate(mission)
    }
}
