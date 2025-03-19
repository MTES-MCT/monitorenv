package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions.MissionEnvActionControlPlanDataOutput
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionSurveillanceDataOutput(
    override val id: UUID,
    val actionEndDateTimeUtc: ZonedDateTime? = null,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val actionType: ActionTypeEnum = ActionTypeEnum.SURVEILLANCE,
    val completedBy: String? = null,
    val completion: ActionCompletionEnum? = null,
    val controlPlans: List<MissionEnvActionControlPlanDataOutput>? = null,
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,
    val observations: String? = null,
    val openBy: String? = null,
    val reportingIds: List<Int>,
    val awareness: AwarenessDataOuput?,
) : EnvActionDataOutput(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        actionType = ActionTypeEnum.SURVEILLANCE,
    ) {
    companion object {
        fun fromEnvActionSurveillanceEntity(
            envActionSurveillanceEntity: EnvActionSurveillanceEntity,
            reportingIds: List<Int>,
        ) = EnvActionSurveillanceDataOutput(
            id = envActionSurveillanceEntity.id,
            actionEndDateTimeUtc = envActionSurveillanceEntity.actionEndDateTimeUtc,
            actionStartDateTimeUtc = envActionSurveillanceEntity.actionStartDateTimeUtc,
            completedBy = envActionSurveillanceEntity.completedBy,
            completion = envActionSurveillanceEntity.completion,
            controlPlans =
                envActionSurveillanceEntity.controlPlans?.let { plans ->
                    if (plans.isNotEmpty()) {
                        plans.map {
                            MissionEnvActionControlPlanDataOutput.fromEnvActionControlPlanEntity(it)
                        }
                    } else {
                        // If the array is empty, return a list containing the
                        // default object
                        val defaultControlPlans =
                            MissionEnvActionControlPlanDataOutput(
                                null,
                                listOf(),
                                listOf(),
                            )
                        listOf(defaultControlPlans)
                    }
                },
            department = envActionSurveillanceEntity.department,
            facade = envActionSurveillanceEntity.facade,
            geom = envActionSurveillanceEntity.geom,
            observations = envActionSurveillanceEntity.observations,
            openBy = envActionSurveillanceEntity.openBy,
            reportingIds = reportingIds,
            awareness =
                envActionSurveillanceEntity.awareness?.let {
                    AwarenessDataOuput.fromAwarenessEntity(
                        it,
                    )
                },
        )
    }
}
