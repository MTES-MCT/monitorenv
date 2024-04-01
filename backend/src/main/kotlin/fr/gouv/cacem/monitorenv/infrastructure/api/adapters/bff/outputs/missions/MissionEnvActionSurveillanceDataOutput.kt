package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class MissionEnvActionSurveillanceDataOutput(
    override val id: UUID,
    val actionEndDateTimeUtc: ZonedDateTime? = null,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val actionType: ActionTypeEnum = ActionTypeEnum.SURVEILLANCE,
    val completion: EnvActionCompletionEnum? = null,
    val controlPlans: List<MissionEnvActionControlPlanDataOutput>? = null,
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,
    val observations: String? = null,
    val reportingIds: List<Int>,
) :
    MissionEnvActionDataOutput(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        actionType = ActionTypeEnum.SURVEILLANCE,
    ) {
    companion object {
        fun fromEnvActionSurveillanceEntity(
            envActionSurveillanceEntity: EnvActionSurveillanceEntity,
            reportingIds: List<Int>,
        ) =
            MissionEnvActionSurveillanceDataOutput(
                id = envActionSurveillanceEntity.id,
                actionEndDateTimeUtc = envActionSurveillanceEntity.actionEndDateTimeUtc,
                actionStartDateTimeUtc = envActionSurveillanceEntity.actionStartDateTimeUtc,
                completion = envActionSurveillanceEntity.completion,
                controlPlans =
                envActionSurveillanceEntity.controlPlans?.map {
                    MissionEnvActionControlPlanDataOutput
                        .fromEnvActionControlPlanEntity(it)
                },
                department = envActionSurveillanceEntity.department,
                facade = envActionSurveillanceEntity.facade,
                geom = envActionSurveillanceEntity.geom,
                observations = envActionSurveillanceEntity.observations,
                reportingIds = reportingIds,
            )
    }
}
