package fr.gouv.cacem.monitorenv.domain.entities.controlResources

data class ControlResourceEntity(
  val id: Int,
  val facade: String? = null,
  val administration: String? = null,
  val resource_name: String? = null,
  val size: String? = null,
  val name: String? = null,
  val city: String? = null,
  val type: String? = null,
  val intervention_zone: String? = null,
  val telephone: String? = null,
  val mail: String? = null,
  val unit: String? = null
)
