package fr.gouv.cacem.monitorenv.domain.validators.mission

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.exceptions.BackendUsageException
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvActionControl
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anEnvActionSurveillance
import fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures.EnvActionFixture.Companion.anInfraction
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.Test
import org.junit.jupiter.params.ParameterizedTest
import org.junit.jupiter.params.provider.EnumSource
import org.junit.jupiter.params.provider.ValueSource
import org.mockito.Mock

class EnvActionValidatorUTest {
    @Mock
    private val envActionsValidator = EnvActionValidator()

    @ParameterizedTest
    @EnumSource(value = InfractionTypeEnum::class, names = ["WAITING"], mode = EnumSource.Mode.EXCLUDE)
    fun `validate should throw an exception if there is a control with infractionType other than WAITING that doesnt have a NATINF`(
        infractionType: InfractionTypeEnum,
    ) {
        val anEnvActionControl =
            anEnvActionControl(infractions = listOf(anInfraction(infractionType = infractionType, natinf = listOf())))

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { envActionsValidator.validate(anEnvActionControl) }
        assertThat(
            assertThrows.data,
        ).isEqualTo("Une infraction doit avoir une natinf si le type d'infraction n'est pas \"En attente\"")
    }

    @Test
    fun `validate should throw an exception if there is a control with infraction and nbTarget is less than 1`() {
        val anEnvActionControl = anEnvActionControl(infractions = listOf(anInfraction(nbTarget = 0)))

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { envActionsValidator.validate(anEnvActionControl) }
        assertThat(assertThrows.data).isEqualTo("le nombre minimum de cible est 1")
    }

    @Test
    fun `validate should throw an exception if there is a control with infractions that got more nbTarget than the mission actionNumberOfControls `() {
        val anEnvActionControl =
            anEnvActionControl(
                actionNumberOfControls = 10,
                infractions = listOf(anInfraction(nbTarget = 10), anInfraction(nbTarget = 5)),
            )

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { envActionsValidator.validate(anEnvActionControl) }
        assertThat(assertThrows.data).isEqualTo("Le nombre de cibles excède le nombre total de contrôles")
    }

    @Test
    fun `validate should pass if there is a control with infractions that got less nbTarget than the mission actionNumberOfControls `() {
        val anEnvActionControl =
            anEnvActionControl(
                actionNumberOfControls = 2,
                infractions = listOf(anInfraction(nbTarget = 1)),
            )

        envActionsValidator.validate(anEnvActionControl)
    }

    @Test
    fun `validate should pass if there is a control with infractionType = WAITING that doesnt have a NATINF`() {
        val anEnvActionControl =
            anEnvActionControl(infractions = listOf(anInfraction(infractionType = InfractionTypeEnum.WAITING)))

        envActionsValidator.validate(anEnvActionControl)
    }

    @ParameterizedTest
    @ValueSource(strings = ["A", "AA", "AAAA"])
    fun `validate should throw an exception if there is a control with openBy is not a trigram`(openBy: String) {
        val anEnvActionControl = anEnvActionControl(openBy = openBy)

        val assertThrows =
            assertThrows(BackendUsageException::class.java) { envActionsValidator.validate(anEnvActionControl) }
        assertThat(assertThrows.data).isEqualTo("Le trigramme \"ouvert par\" doit avoir 3 lettres")
    }

    @Test
    fun `validate should pass if there is a surveillance without geometry`() {
        val anEnvActionSurveillance = anEnvActionSurveillance(geom = null)
        val assertThrows =
            assertThrows(BackendUsageException::class.java) { envActionsValidator.validate(anEnvActionSurveillance) }
        assertThat(assertThrows.data).isEqualTo("La géométrie de la surveillance est obligatoire")
    }

    @Test
    fun `validate should pass for a valid surveillance`() {
        val envAction = anEnvActionSurveillance()

        envActionsValidator.validate(envAction)
    }

    @Test
    fun `validate should pass for a valid control`() {
        val envAction = anEnvActionControl()

        envActionsValidator.validate(envAction)
    }
}
