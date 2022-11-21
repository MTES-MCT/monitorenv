package fr.gouv.cacem.monitorenv.domain.entities.missions

import org.locationtech.jts.geom.MultiPoint
import java.time.ZonedDateTime
import java.util.*

data class EnvActionSurveillanceProperties(
    val actionTheme: String? = null,
    val actionSubTheme: String? = null,
    val protectedSpecies: List<String>? = listOf(),
    val duration: Double? = null,
    val observations: String? = null,
    val coverMissionZone: Boolean? = null
) {
    fun toEnvActionSurveillanceEntity(id: UUID, actionStartDateTimeUtc: ZonedDateTime?, geom: MultiPoint?) = EnvActionSurveillanceEntity(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        geom = geom,
        actionTheme = actionTheme,
        actionSubTheme = actionSubTheme,
        protectedSpecies = protectedSpecies,
        duration = duration,
        observations = observations,
        coverMissionZone = coverMissionZone
    )
    companion object {
        fun fromEnvActionSurveillanceEntity(envAction: EnvActionSurveillanceEntity) = EnvActionSurveillanceProperties(
            actionTheme = envAction.actionTheme,
            actionSubTheme = envAction.actionSubTheme,
            protectedSpecies = envAction.protectedSpecies,
            duration = envAction.duration,
            observations = envAction.observations,
            coverMissionZone = envAction.coverMissionZone
        )
    }
}
