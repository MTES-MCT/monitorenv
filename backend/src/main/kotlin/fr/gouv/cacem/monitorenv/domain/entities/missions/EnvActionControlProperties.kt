package fr.gouv.cacem.monitorenv.domain.entities.missions

import org.locationtech.jts.geom.MultiPoint
import java.time.ZonedDateTime
import java.util.*

data class EnvActionControlProperties(
  val actionStartDatetimeUtc: ZonedDateTime? = null,
  val geom: MultiPoint? = null,
  val actionTheme: String? = null,
  val actionSubTheme: String? = null,
  val protectedSpecies: List<String>? = listOf(),
  val actionNumberOfControls: Int? = null,
  val actionTargetType: String? = null,
  val vehicleType: String? = null,
// override val actionTargetType: ActionTargetTypeEnum? = null,
// override val vehicleType: VehicleTypeEnum? = null,
  val infractions: List<InfractionEntity>? = listOf()
) {
  fun toEnvActionControlEntity(id: UUID) = EnvActionControlEntity(
    id = id,
    actionStartDatetimeUtc = actionStartDatetimeUtc,
    geom = geom,
    actionTheme = actionTheme,
    actionSubTheme = actionSubTheme,
    protectedSpecies = protectedSpecies,
    actionNumberOfControls = actionNumberOfControls,
    actionTargetType = actionTargetType,
    vehicleType = vehicleType,
    infractions = infractions
  )
}
