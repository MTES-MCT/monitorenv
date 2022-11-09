package fr.gouv.cacem.monitorenv.domain.entities.missions

import java.time.ZonedDateTime
import java.util.*

data class EnvActionSurveillanceProperties(
    val actionStartDatetimeUtc: ZonedDateTime? = null,
    val actionTheme: String? = null,
    val actionSubTheme: String? = null,
    val protectedSpecies: List<String>? = listOf(),
    val duration: Double? = null,
    val observations: String? = null
) {
    fun toEnvActionSurveillanceEntity(id: UUID) = EnvActionSurveillanceEntity(
        id = id,
        actionStartDatetimeUtc = actionStartDatetimeUtc,
        actionTheme = actionTheme,
        actionSubTheme = actionSubTheme,
        protectedSpecies = protectedSpecies,
        duration = duration,
        observations = observations
    )
}
