package fr.gouv.cacem.monitorenv.domain.entities.controlResources

data class ControlUnitEntity(
    val id: Int,
    val administration: String,
    val name: String,
    val resources: List<ControlResourceEntity>,
    val contact: String? = null
)
