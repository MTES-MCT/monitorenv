package fr.gouv.cacem.monitorenv.domain.validators.mission

import com.nhaarman.mockitokotlin2.verify
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvActionControl
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvActionSurveillance
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anInfraction
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.fixtures.MissionFixture.Companion.aMissionEntity
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.mockito.Mock
import org.mockito.Mockito.mock
import java.time.ZonedDateTime

class MissionValidatorWithEnvActionsUTest {
    @Mock
    private val missionValidator: MissionValidator = mock()
    private val envActionValidator: EnvActionValidator = mock()
    private val missionWithEnvActionsValidator = MissionWithEnvActionsValidator(missionValidator, envActionValidator)

    @Test
    fun `validate call mission validator and envAction validators`() {
        val mission = aMissionEntity()

        missionWithEnvActionsValidator.validate(mission)
        verify(missionValidator).validate(mission)
        mission.envActions?.forEach {
            verify(envActionValidator).validate(it)
        }
    }

    @Test
    fun `validate should throw an exception if there is a control with a start date before mission starting date`() {
        val startDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val anEnvActionControl = anEnvActionControl(startTime = startDateTimeUtc.minusSeconds(1))
        val mission = aMissionEntity(startDateTimeUtc = startDateTimeUtc, envActions = listOf(anEnvActionControl))

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { missionWithEnvActionsValidator.validate(mission) }
        assertThat(
            assertThrows.data,
        ).isEqualTo("La date de début du contrôle doit être postérieure à celle du début de mission")
    }

    @Test
    fun `validate should pass if there is a control with the same start date as mission's`() {
        val startDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val endDateTimeUtc = ZonedDateTime.parse("2021-03-04T00:00:00.000Z")
        val anEnvActionControl = anEnvActionControl(startTime = startDateTimeUtc)
        val mission =
            aMissionEntity(
                startDateTimeUtc = startDateTimeUtc,
                endDateTimeUtc = endDateTimeUtc,
                envActions = listOf(anEnvActionControl),
            )

        missionWithEnvActionsValidator.validate(mission)
    }

    @Test
    fun `validate should pass if there is a control with infractions that got less nbTarget than the mission actionNumberOfControls `() {
        val anEnvActionControl =
            anEnvActionControl(
                actionNumberOfControls = 2,
                infractions = listOf(anInfraction(nbTarget = 1)),
            )
        val mission = aMissionEntity(envActions = listOf(anEnvActionControl))

        missionWithEnvActionsValidator.validate(mission)
    }

    @Test
    fun `validate should pass if there is a control with infractionType = WAITING that doesnt have a NATINF`() {
        val anEnvActionControl =
            anEnvActionControl(infractions = listOf(anInfraction(infractionType = InfractionTypeEnum.WAITING)))
        val mission = aMissionEntity(envActions = listOf(anEnvActionControl))

        missionWithEnvActionsValidator.validate(mission)
    }

    @Test
    fun `validate should throw an exception if there is a surveillance with a start date before mission starting date`() {
        val startDateTimeUtc = ZonedDateTime.parse("2020-03-04T00:00:00.000Z")
        val anEnvActionSurveillance = anEnvActionSurveillance(startTime = startDateTimeUtc.minusSeconds(1))
        val mission = aMissionEntity(startDateTimeUtc = startDateTimeUtc, envActions = listOf(anEnvActionSurveillance))

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { missionWithEnvActionsValidator.validate(mission) }
        assertThat(
            assertThrows.data,
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

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { missionWithEnvActionsValidator.validate(mission) }
        assertThat(
            assertThrows.data,
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

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { missionWithEnvActionsValidator.validate(mission) }
        assertThat(
            assertThrows.data,
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

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { missionWithEnvActionsValidator.validate(mission) }
        assertThat(
            assertThrows.data,
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

        missionWithEnvActionsValidator.validate(mission)
    }

    @Test
    fun `validate should pass for a valid MissionEntity`() {
        val mission = aMissionEntity()

        missionWithEnvActionsValidator.validate(mission)
    }
}
