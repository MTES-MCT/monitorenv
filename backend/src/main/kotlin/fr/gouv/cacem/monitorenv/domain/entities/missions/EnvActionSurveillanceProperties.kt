package fr.gouv.cacem.monitorenv.domain.entities.missions

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class EnvActionSurveillanceProperties(
    val themes: List<ThemeEntity>? = listOf(),
    val duration: Double? = null,
    val observations: String? = null,
    val coverMissionZone: Boolean? = null,
) {
    fun toEnvActionSurveillanceEntity(id: UUID, actionStartDateTimeUtc: ZonedDateTime?, geom: Geometry?) = EnvActionSurveillanceEntity(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        geom = geom,
        themes = themes,
        duration = duration,
        observations = observations,
        coverMissionZone = coverMissionZone,
    )
    companion object {
        fun fromEnvActionSurveillanceEntity(envAction: EnvActionSurveillanceEntity) = EnvActionSurveillanceProperties(
            themes = envAction.themes,
            duration = envAction.duration,
            observations = envAction.observations,
            coverMissionZone = envAction.coverMissionZone,
        )
    }
}
