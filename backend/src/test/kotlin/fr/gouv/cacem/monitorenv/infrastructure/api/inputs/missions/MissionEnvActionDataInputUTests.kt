import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.MissionEnvActionDataInput
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime
import java.util.Optional
import java.util.UUID

@ExtendWith(SpringExtension::class)
class MissionEnvActionDataInputUTests {

    @MockBean private lateinit var missionEnvActionDataInput: MissionEnvActionDataInput

    @Test
    fun toEnvActionEntityControlType() {
        val input =
            MissionEnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.CONTROL,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                department = "TestDepartment",
                facade = "TestFacade",
                actionNumberOfControls = 3,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                infractions = listOf(),
                observations = "Observations",
                reportingIds = Optional.of(listOf(1)),
            )

        val entity = input.toEnvActionEntity()

        // Perform assertions to verify the correctness of the conversion
        assertTrue(entity is EnvActionControlEntity)
    }

    @Test
    fun toEnvActionEntitySurveillanceType() {
        val input =
            MissionEnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.SURVEILLANCE,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                department = "TestDepartment",
                facade = "TestFacade",
                observations = "Observations",
                reportingIds = Optional.of(listOf()),
            )

        val entity = input.toEnvActionEntity()

        // Perform assertions to verify the correctness of the conversion
        assertTrue(entity is EnvActionSurveillanceEntity)
    }

    @Test
    fun toEnvActionEntityNoteType() {
        val input =
            MissionEnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.NOTE,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                observations = "Observations",
                reportingIds = Optional.empty(),
            )

        val entity = input.toEnvActionEntity()

        // Perform assertions to verify the correctness of the conversion
        assertTrue(entity is EnvActionNoteEntity)
    }

    @Test
    fun `toEnvActionEntity should fail when reportingIds is set in Note Action`() {
        val input =
            MissionEnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.NOTE,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                observations = "Observations",
                reportingIds = Optional.of(listOf(1, 2, 3)),
            )

        assertThrows(IllegalArgumentException::class.java) { input.toEnvActionEntity() }
    }

    @Test
    fun `toEnvActionEntity should fail when reportingIds is not set for Surveillance Action`() {
        val input =
            MissionEnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.SURVEILLANCE,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                department = "TestDepartment",
                facade = "TestFacade",
                observations = "Observations",
                reportingIds = Optional.empty(),
            )

        assertThrows(IllegalArgumentException::class.java) { input.toEnvActionEntity() }
    }

    @Test
    fun `toEnvActionEntity should fail when reportingIds is not set for control Actions`() {
        val input =
            MissionEnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.CONTROL,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                department = "TestDepartment",
                facade = "TestFacade",
                actionNumberOfControls = 3,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                infractions = listOf(),
                observations = "Observations",
                reportingIds = Optional.empty(),
            )

        assertThrows(IllegalArgumentException::class.java) { input.toEnvActionEntity() }
    }

    @Test
    fun `toEnvActionEntity should fail when reportingIds is set with more than 1 id for control Actions`() {
        val input =
            MissionEnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.CONTROL,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                department = "TestDepartment",
                facade = "TestFacade",
                actionNumberOfControls = 3,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                infractions = listOf(),
                observations = "Observations",
                reportingIds = Optional.of(listOf(1, 2)),
            )

        assertThrows(IllegalArgumentException::class.java) { input.toEnvActionEntity() }
    }
}
