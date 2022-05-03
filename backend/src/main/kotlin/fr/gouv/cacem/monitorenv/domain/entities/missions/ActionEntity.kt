package fr.gouv.cacem.monitorenv.domain.entities.missions
import java.time.ZonedDateTime

data class ActionEntity (
  val actionType: ActionTypeEnum,
  val actionTheme: String? = null,
  val actionSubTheme: String? = null,
  val protectedSpecies: String? = null,
  val actionStartDatetimeUtc: ZonedDateTime? = null,
  val actionNumberOfControls: Int? = null,
  val actionTargetType: String? = null,
  val actionControlType: String? = null,
  val infractions: List<InfractionEntity>? = listOf()
)
