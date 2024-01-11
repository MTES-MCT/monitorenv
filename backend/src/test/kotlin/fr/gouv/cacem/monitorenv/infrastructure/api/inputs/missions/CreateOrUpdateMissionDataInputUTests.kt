package fr.gouv.cacem.monitorenv.infrastructure.api.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.CreateOrUpdateMissionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.MissionEnvActionDataInput
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.junit.jupiter.SpringExtension
import java.time.ZonedDateTime
import java.util.Optional
import java.util.UUID

@ExtendWith(SpringExtension::class)
class CreateOrUpdateMissionDataInputUTests {
    @MockBean private lateinit var missionEnvActionDataInput: MissionEnvActionDataInput

    @Test
    fun `getEnvActionsAttachedToReportings should return reportingIds pairs`() {
        // given
        val envActionControl =
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
        val envActionSurveillance =
            MissionEnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.SURVEILLANCE,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                department = "TestDepartment",
                facade = "TestFacade",
                coverMissionZone = true,
                observations = "Observations",
                reportingIds = Optional.of(listOf(2, 3)),
            )
        val envActionNote =
            MissionEnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.NOTE,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                observations = "Observations",
                reportingIds = Optional.empty(),
            )
        val missionDataInput =
            CreateOrUpdateMissionDataInput(
                missionTypes = listOf(MissionTypeEnum.LAND),
                observationsCacem = null,
                facade = "Outre-Mer",
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                isClosed = false,
                missionSource = MissionSourceEnum.MONITORENV,
                attachedReportingIds = listOf(),
                envActions = listOf(envActionControl, envActionSurveillance, envActionNote),
            )

        // when
        val result = missionDataInput.getEnvActionsAttachedToReportings()
        assertThat(
            result,
        )
            .isEqualTo(
                listOf(
                    Pair(envActionControl.id, listOf(1)),
                    Pair(envActionSurveillance.id, listOf(2, 3)),
                ),
            )
    }
}
