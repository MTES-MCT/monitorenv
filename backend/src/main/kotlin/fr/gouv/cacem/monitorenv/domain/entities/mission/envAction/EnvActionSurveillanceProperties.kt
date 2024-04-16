package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionSurveillanceProperties(
    val observations: String? = null,
) {
    fun toEnvActionSurveillanceEntity(
        id: UUID,
        actionStartDateTimeUtc: ZonedDateTime?,
        actionEndDateTimeUtc: ZonedDateTime?,
        completion: ActionCompletionEnum?,
        controlPlans: List<EnvActionControlPlanEntity>?,
        department: String?,
        facade: String?,
        geom: Geometry?,
    ) =
        EnvActionSurveillanceEntity(
            id = id,
            actionStartDateTimeUtc = actionStartDateTimeUtc,
            actionEndDateTimeUtc = actionEndDateTimeUtc,
            completion = completion,
            controlPlans = controlPlans,
            department = department,
            facade = facade,
            geom = geom,
            observations = observations,
        )
    companion object {
        fun fromEnvActionSurveillanceEntity(envAction: EnvActionSurveillanceEntity) =
            EnvActionSurveillanceProperties(
                observations = envAction.observations,
            )
    }
}
