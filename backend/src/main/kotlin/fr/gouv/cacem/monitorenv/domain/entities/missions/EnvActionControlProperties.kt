package fr.gouv.cacem.monitorenv.domain.entities.missions

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class EnvActionControlProperties(
    val themes: List<ThemeEntity>? = listOf(),
    val observations: String? = null,
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val infractions: List<InfractionEntity>? = listOf()
) {
    fun toEnvActionControlEntity(id: UUID, actionStartDateTimeUtc: ZonedDateTime?, geom: Geometry?) = EnvActionControlEntity(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        geom = geom,
        themes = themes,
        observations = observations,
        actionNumberOfControls = actionNumberOfControls,
        actionTargetType = actionTargetType,
        vehicleType = vehicleType,
        infractions = infractions
    )
    companion object {
        fun fromEnvActionControlEntity(envAction: EnvActionControlEntity) = EnvActionControlProperties(
            themes = envAction.themes,
            observations = envAction.observations,
            actionNumberOfControls = envAction.actionNumberOfControls,
            actionTargetType = envAction.actionTargetType,
            vehicleType = envAction.vehicleType,
            infractions = envAction.infractions
        )
    }
}
