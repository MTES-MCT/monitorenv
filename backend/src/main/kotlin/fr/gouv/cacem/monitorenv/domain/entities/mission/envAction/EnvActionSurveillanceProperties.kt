package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class EnvActionSurveillanceProperties(
    val coverMissionZone: Boolean? = null,
    val observations: String? = null,
    @Deprecated("Use controlPlans instead") val themes: List<ThemeEntity>? = listOf(),
) {
    fun toEnvActionSurveillanceEntity(
        id: UUID,
        actionStartDateTimeUtc: ZonedDateTime?,
        actionEndDateTimeUtc: ZonedDateTime?,
        controlPlans: List<EnvActionControlPlanEntity>?,
        department: String?,
        facade: String?,
        geom: Geometry?,
    ) =
        EnvActionSurveillanceEntity(
            id = id,
            actionStartDateTimeUtc = actionStartDateTimeUtc,
            actionEndDateTimeUtc = actionEndDateTimeUtc,
            controlPlans = controlPlans,
            coverMissionZone = coverMissionZone,
            department = department,
            facade = facade,
            geom = geom,
            observations = observations,
            themes = themes,
        )
    companion object {
        fun fromEnvActionSurveillanceEntity(envAction: EnvActionSurveillanceEntity) =
            EnvActionSurveillanceProperties(
                coverMissionZone = envAction.coverMissionZone,
                observations = envAction.observations,
                themes = envAction.themes,
            )
    }
}
