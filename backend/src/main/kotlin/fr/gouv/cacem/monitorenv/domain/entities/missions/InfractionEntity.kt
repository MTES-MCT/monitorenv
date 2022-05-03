package fr.gouv.cacem.monitorenv.domain.entities.missions

data class InfractionEntity(
  val natinf: List<String>? = listOf(),
  val observations: String? = null,
  val registryNumber: String? = null,
  val competentTribunal: String? = null,
  val officialReport: Boolean? = null,
  val formalNotice: FormalNoticeEnum,
  val toProcess: Boolean,
)
