package fr.gouv.cacem.monitorenv.domain.entities.missions

data class InfractionEntity(
  val id: String,
  val natinf: List<String>? = listOf(),
  val observations: String? = null,
  val registrationNumber: String? = null,
  val relevantCourt: String? = null,
  val infractionType: Boolean? = null,
  val formalNotice: FormalNoticeEnum,
  val toProcess: Boolean,
  val owner: String? = null,
  val vehicle: String? = null,
  val size: String? = null,
)
