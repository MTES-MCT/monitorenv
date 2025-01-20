package fr.gouv.cacem.monitorenv.domain.use_cases.actions.fixtures

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MonitorFishActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.AdministrativeResponseEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.FormalNoticeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.SeizureTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.monitorfish.MonitorFishMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
import java.time.ZonedDateTime
import java.util.UUID
import kotlin.random.Random

class EnvActionFixture {
    companion object {
        fun anEnvAction(
            mapper: ObjectMapper,
            id: UUID,
            startTime: ZonedDateTime? = null,
            endTime: ZonedDateTime? = null,
            observationsByUnit: String? = null,
            missionId: Int? = 1,
            controlPlans: List<EnvActionControlPlanEntity>? = null,
        ): EnvActionEntity {
            return EnvActionMapper.getEnvActionEntityFromJSON(
                mapper,
                id = id,
                actionType = ActionTypeEnum.SURVEILLANCE,
                actionEndDateTimeUtc = endTime,
                actionStartDateTimeUtc = startTime,
                completedBy = "John Doe",
                completion = ActionCompletionEnum.COMPLETED,
                controlPlans = controlPlans,
                department = "Department X",
                facade = "Facade Y",
                geom = null,
                isAdministrativeControl = true,
                isComplianceWithWaterRegulationsControl = false,
                isSafetyEquipmentAndStandardsComplianceControl = true,
                isSeafarersControl = false,
                observationsByUnit = observationsByUnit,
                openBy = "Jane Doe",
                missionId = missionId,
                value = "{}",
            )
        }

        fun anEnvActionControl(
            startTime: ZonedDateTime? = null,
            endTime: ZonedDateTime? = null,
            openBy: String = "MPE",
            infractions: List<InfractionEntity> = listOf(),
            actionNumberOfControls: Int? = infractions.size,
            actionTargetTypeEnum: ActionTargetTypeEnum? = null,
            vehicleTypeEnum: VehicleTypeEnum? = null,
            controlPlans: List<EnvActionControlPlanEntity>? =
                listOf(EnvActionControlPlanEntity(subThemeIds = listOf(1))),
        ): EnvActionControlEntity {
            return EnvActionControlEntity(
                id = UUID.randomUUID(),
                actionStartDateTimeUtc = startTime,
                actionEndDateTimeUtc = endTime,
                openBy = openBy,
                infractions = infractions,
                actionNumberOfControls = actionNumberOfControls,
                actionTargetType = actionTargetTypeEnum,
                vehicleType = vehicleTypeEnum,
                controlPlans = controlPlans,
            )
        }

        fun anEnvActionSurveillance(
            startTime: ZonedDateTime? = null,
            endTime: ZonedDateTime? = null,
            openBy: String? = "CDA",
            controlPlans: List<EnvActionControlPlanEntity>? = listOf(),
        ): EnvActionSurveillanceEntity {
            return EnvActionSurveillanceEntity(
                id = UUID.randomUUID(),
                actionStartDateTimeUtc = startTime,
                actionEndDateTimeUtc = endTime,
                openBy = openBy,
                awareness = null,
                controlPlans = controlPlans,
            )
        }

        fun anInfraction(
            infractionType: InfractionTypeEnum = InfractionTypeEnum.WAITING,
            nbTarget: Int = 1,
        ) = InfractionEntity(
            id = Random.nextInt().toString(),
            administrativeResponse = AdministrativeResponseEnum.NONE,
            infractionType = infractionType,
            formalNotice = FormalNoticeEnum.NO,
            seizure = SeizureTypeEnum.NO,
            nbTarget = nbTarget,
        )

        fun aMonitorFishAction(missionId: Int): MonitorFishMissionActionEntity {
            return MonitorFishMissionActionEntity(
                id = 1,
                actionDatetimeUtc = ZonedDateTime.now().toString(),
                actionType = MonitorFishActionTypeEnum.AIR_CONTROL,
                completion = ActionCompletionEnum.COMPLETED,
                missionId = missionId,
                numberOfVesselsFlownOver = null,
            )
        }
    }
}
