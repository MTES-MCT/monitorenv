package fr.gouv.cacem.monitorenv.domain.entities.missions
import org.locationtech.jts.geom.MultiPoint
import java.time.ZonedDateTime

data class ActionEntity (
  val id: String,
  val actionType: ActionTypeEnum,
  val actionTheme: String? = null,
  val actionSubTheme: String? = null,
  val protectedSpecies: List<String>? = listOf(),
  val actionStartDatetimeUtc: ZonedDateTime? = null,
  val actionNumberOfControls: Int? = null,
  val actionTargetType: String? = null,
  val vehicleType: String? = null,
  val geom: MultiPoint? = null,
  val infractions: List<InfractionEntity>? = listOf()
)
