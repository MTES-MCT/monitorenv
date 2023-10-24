package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import java.time.ZonedDateTime
import java.util.UUID
import org.locationtech.jts.geom.Geometry

data class EnvActionSurveillanceProperties(
        val themes: List<ThemeEntity>? = listOf(),
        val observations: String? = null,
        val coverMissionZone: Boolean? = null,
) {
    fun toEnvActionSurveillanceEntity(
            id: UUID,
            actionStartDateTimeUtc: ZonedDateTime?,
            actionEndDateTimeUtc: ZonedDateTime?,
            facade: String?,
            department: String?,
            geom: Geometry?,
    ) =
            EnvActionSurveillanceEntity(
                    id = id,
                    actionStartDateTimeUtc = actionStartDateTimeUtc,
                    actionEndDateTimeUtc = actionEndDateTimeUtc,
                    facade = facade,
                    department = department,
                    geom = geom,
                    themes = themes,
                    observations = observations,
                    coverMissionZone = coverMissionZone,
            )
    companion object {
        fun fromEnvActionSurveillanceEntity(envAction: EnvActionSurveillanceEntity) =
                EnvActionSurveillanceProperties(
                        themes = envAction.themes,
                        observations = envAction.observations,
                        coverMissionZone = envAction.coverMissionZone,
                )
    }
}
