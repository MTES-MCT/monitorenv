package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.missions

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.actions.EnvActionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.CreateOrUpdateMissionDataInput
import org.assertj.core.api.Assertions.assertThat
import org.junit.jupiter.api.Test
import java.time.ZonedDateTime
import java.util.Optional
import java.util.UUID

class CreateOrUpdateMissionDataInputUTests {
    @Test
    fun `getEnvActionsAttachedToReportings should return reportingIds pairs`() {
        // given
        val envActionControl =
            EnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.CONTROL,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                actionEndDateTimeUtc = ZonedDateTime.now().plusHours(1),
                completedBy = "ABC",
                completion = ActionCompletionEnum.TO_COMPLETE,
                department = "TestDepartment",
                facade = "TestFacade",
                actionNumberOfControls = 3,
                actionTargetType = ActionTargetTypeEnum.VEHICLE,
                vehicleType = VehicleTypeEnum.VESSEL,
                infractions = listOf(),
                observations = "Observations",
                openBy = "DEF",
                reportingIds = Optional.of(listOf(1)),
                awareness = null,
            )
        val envActionSurveillance =
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
                reportingIds = Optional.of(listOf(2, 3)),
                awareness = null,
            )
        val envActionNote =
            EnvActionDataInput(
                id = UUID.randomUUID(),
                actionType = ActionTypeEnum.NOTE,
                actionStartDateTimeUtc = ZonedDateTime.now(),
                completion = ActionCompletionEnum.TO_COMPLETE,
                observations = "Observations",
                reportingIds = Optional.of(listOf()),
                awareness = null,
            )
        val missionDataInput =
            CreateOrUpdateMissionDataInput(
                missionTypes = listOf(MissionTypeEnum.LAND),
                observationsCacem = null,
                facade = "Outre-Mer",
                startDateTimeUtc = ZonedDateTime.parse("2022-01-15T04:50:09Z"),
                endDateTimeUtc = ZonedDateTime.parse("2022-01-23T20:29:03Z"),
                missionSource = MissionSourceEnum.MONITORENV,
                attachedReportingIds = listOf(),
                envActions = listOf(envActionControl, envActionSurveillance, envActionNote),
                isGeometryComputedFromControls = false,
                createdAtUtc = null,
                updatedAtUtc = null,
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
