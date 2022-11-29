package fr.gouv.cacem.monitorenv.domain.entities.missions

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class EnvActionControlProperties(
    val actionStartDateTimeUtc: ZonedDateTime? = null,
    val geom: Geometry? = null,
    val actionTheme: String? = null,
    val actionSubTheme: String? = null,
    val protectedSpecies: List<String>? = listOf(),
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum,
    val vehicleType: VehicleTypeEnum? = null,
    val infractions: List<InfractionEntity>? = listOf()
) {
    fun toEnvActionControlEntity(id: UUID, actionStartDateTimeUtc: ZonedDateTime?, geom: Geometry?) = EnvActionControlEntity(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        geom = geom,
        actionTheme = actionTheme,
        actionSubTheme = actionSubTheme,
        protectedSpecies = protectedSpecies,
        actionNumberOfControls = actionNumberOfControls,
        actionTargetType = actionTargetType,
        vehicleType = vehicleType,
        infractions = infractions
    )
    companion object {
        fun fromEnvActionControlEntity(envAction: EnvActionControlEntity) = EnvActionControlProperties(
            actionTheme = envAction.actionTheme,
            actionSubTheme = envAction.actionSubTheme,
            protectedSpecies = envAction.protectedSpecies,
            actionNumberOfControls = envAction.actionNumberOfControls,
            actionTargetType = envAction.actionTargetType,
            vehicleType = envAction.vehicleType,
            infractions = envAction.infractions
        )
    }
}
