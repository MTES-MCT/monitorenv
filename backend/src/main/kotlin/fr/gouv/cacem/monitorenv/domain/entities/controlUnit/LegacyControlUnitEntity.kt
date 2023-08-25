package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

data class LegacyControlUnitEntity(
    val id: Int,
    val administration: String,
    val isArchived: Boolean,
    val name: String,
    val resources: List<LegacyControlResourceEntity>,
    val contact: String? = null,
)
