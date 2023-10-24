package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

// TODO Replace this entity with `ControlUnitEntity`. It's left for `MissionEntity.units` backward compatibility.
data class LegacyControlUnitEntity(
    val id: Int,
    val administration: String,
    val isArchived: Boolean,
    val name: String,
    val resources: List<LegacyControlUnitResourceEntity>,
    val contact: String? = null,
)
