package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.missions

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.actions.EnvActionDataInput
import org.junit.jupiter.api.Assertions
import org.junit.jupiter.api.Test
import java.time.ZonedDateTime
import java.util.Optional
import java.util.UUID

class EnvActionDataInputUTests {
    @Test
    fun toEnvActionEntityControlType() {
        val input =
            EnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.CONTROL,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                completedBy = "DEF",
                completion = ActionCompletionEnum.TO_COMPLETE,
                department = "TestDepartment",
                facade = "TestFacade",
                actionNumberOfControls = 3,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                infractions = listOf(),
                observations = "Observations",
                openBy = "ABC",
                awareness = null,
                reportingIds = Optional.of(listOf(1)),
                tags = listOf(),
                themes = listOf(),
            )

        val entity = input.toEnvActionEntity()

        Assertions.assertTrue(entity is EnvActionControlEntity)
    }

    @Test
    fun toEnvActionEntitySurveillanceType() {
        val input =
            EnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.SURVEILLANCE,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                completedBy = "DEF",
                completion = ActionCompletionEnum.TO_COMPLETE,
                department = "TestDepartment",
                facade = "TestFacade",
                observations = "Observations",
                openBy = "ABC",
                awareness = null,
                reportingIds = Optional.of(listOf()),
                tags = listOf(),
                themes = listOf(),
            )

        val entity = input.toEnvActionEntity()

        Assertions.assertTrue(entity is EnvActionSurveillanceEntity)
    }

    @Test
    fun toEnvActionEntityNoteType() {
        val input =
            EnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.NOTE,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                completion = ActionCompletionEnum.TO_COMPLETE,
                observations = "Observations",
                awareness = null,
                reportingIds = Optional.empty(),
                tags = listOf(),
                themes = listOf(),
            )

        val entity = input.toEnvActionEntity()

        Assertions.assertTrue(entity is EnvActionNoteEntity)
    }

    @Test
    fun `toEnvActionEntity should fail when reportingIds is set in Note Action`() {
        val input =
            EnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.NOTE,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                completion = ActionCompletionEnum.TO_COMPLETE,
                observations = "Observations",
                awareness = null,
                reportingIds = Optional.of(listOf(1, 2, 3)),
                tags = listOf(),
                themes = listOf(),
            )

        Assertions.assertThrows(IllegalArgumentException::class.java) { input.toEnvActionEntity() }
    }

    @Test
    fun `toEnvActionEntity should fail when reportingIds is not set for Surveillance Action`() {
        val input =
            EnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.SURVEILLANCE,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                completedBy = "DEF",
                completion = ActionCompletionEnum.TO_COMPLETE,
                department = "TestDepartment",
                facade = "TestFacade",
                observations = "Observations",
                openBy = "ABC",
                awareness = null,
                reportingIds = Optional.empty(),
                tags = listOf(),
                themes = listOf(),
            )

        Assertions.assertThrows(IllegalArgumentException::class.java) { input.toEnvActionEntity() }
    }

    @Test
    fun `toEnvActionEntity should fail when reportingIds is not set for control Actions`() {
        val input =
            EnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.CONTROL,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                completedBy = "DEF",
                completion = ActionCompletionEnum.TO_COMPLETE,
                department = "TestDepartment",
                facade = "TestFacade",
                actionNumberOfControls = 3,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                infractions = listOf(),
                observations = "Observations",
                openBy = "ABC",
                awareness = null,
                reportingIds = Optional.empty(),
                tags = listOf(),
                themes = listOf(),
            )

        Assertions.assertThrows(IllegalArgumentException::class.java) { input.toEnvActionEntity() }
    }

    @Test
    fun `toEnvActionEntity should fail when reportingIds is set with more than 1 id for control Actions`() {
        val input =
            EnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.CONTROL,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                completedBy = "DEF",
                completion = ActionCompletionEnum.TO_COMPLETE,
                department = "TestDepartment",
                facade = "TestFacade",
                actionNumberOfControls = 3,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                infractions = listOf(),
                observations = "Observations",
                openBy = "ABC",
                awareness = null,
                reportingIds = Optional.of(listOf(1, 2)),
                tags = listOf(),
                themes = listOf(),
            )

        Assertions.assertThrows(IllegalArgumentException::class.java) { input.toEnvActionEntity() }
    }
}
