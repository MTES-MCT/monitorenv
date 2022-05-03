package fr.gouv.cacem.monitorenv.domain.entities.missions
import java.time.ZonedDateTime

data class ActionEntity (
  val actionTheme: String? = null,
  val actionStartDatetimeUtc: ZonedDateTime? = null,
  val actionNumberOfControls: Int? = null,
  val actionActivityType: String? = null,
  val infractions: List<InfractionEntity>? = null

)
