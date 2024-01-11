package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class MissionEnvActionSurveillanceDataOutput(
    override val id: UUID,
    val actionEndDateTimeUtc: ZonedDateTime? = null,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val actionType: ActionTypeEnum = ActionTypeEnum.SURVEILLANCE,
    val controlPlans: List<MissionEnvActionControlPlanDataOutput>? = null,
    val coverMissionZone: Boolean? = null,
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,
    val observations: String? = null,
) :
    MissionEnvActionDataOutput(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        actionType = ActionTypeEnum.SURVEILLANCE,
    ) {
    companion object {
        fun fromEnvActionSurveillanceEntity(
            envActionSurveillanceEntity: EnvActionSurveillanceEntity,
        ) =
            MissionEnvActionSurveillanceDataOutput(
                id = envActionSurveillanceEntity.id,
                actionEndDateTimeUtc = envActionSurveillanceEntity.actionEndDateTimeUtc,
                actionStartDateTimeUtc = envActionSurveillanceEntity.actionStartDateTimeUtc,
                controlPlans = envActionSurveillanceEntity.controlPlans?.map {
                    MissionEnvActionControlPlanDataOutput.fromEnvActionControlPlanEntity(it)
                },
                department = envActionSurveillanceEntity.department,
                facade = envActionSurveillanceEntity.facade,
                geom = envActionSurveillanceEntity.geom,
                coverMissionZone = envActionSurveillanceEntity.coverMissionZone,
                observations = envActionSurveillanceEntity.observations,
            )
    }
}
