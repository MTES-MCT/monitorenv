package fr.gouv.cacem.monitorenv.domain.entities.missions

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class EnvActionSurveillanceProperties(
    val themes: List<ThemeEntity>? = listOf(),
    val observations: String? = null,
    val coverMissionZone: Boolean? = null,
) {
    fun toEnvActionSurveillanceEntity(id: UUID, actionStartDateTimeUtc: ZonedDateTime?, actionEndDateTimeUtc: ZonedDateTime?, geom: Geometry?) = EnvActionSurveillanceEntity(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        actionEndDateTimeUtc = actionEndDateTimeUtc,
        geom = geom,
        themes = themes,
        observations = observations,
        coverMissionZone = coverMissionZone,
    )
    companion object {
        fun fromEnvActionSurveillanceEntity(envAction: EnvActionSurveillanceEntity) = EnvActionSurveillanceProperties(
            themes = envAction.themes,
            observations = envAction.observations,
            coverMissionZone = envAction.coverMissionZone,
        )
    }
}
