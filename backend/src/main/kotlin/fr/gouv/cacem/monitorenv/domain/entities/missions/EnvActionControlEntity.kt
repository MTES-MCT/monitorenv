package fr.gouv.cacem.monitorenv.domain.entities.missions

import org.locationtech.jts.geom.MultiPoint
import java.time.ZonedDateTime
import java.util.*

data class EnvActionControlEntity(
  override val id: UUID,
  override val actionStartDatetimeUtc: ZonedDateTime? = null,
  override val geom: MultiPoint? = null,
  val actionTheme: String? = null,
  val actionSubTheme: String? = null,
  val protectedSpecies: List<String>? = listOf(),
  val actionNumberOfControls: Int? = null,
  val actionTargetType: ActionTargetTypeEnum,
  val vehicleType: VehicleTypeEnum? = null,
  val infractions: List<InfractionEntity>? = listOf()
): EnvActionEntity(
  id = id,
  actionType = ActionTypeEnum.CONTROL,
)

