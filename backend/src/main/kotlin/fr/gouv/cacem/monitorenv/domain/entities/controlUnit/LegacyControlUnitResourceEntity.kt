package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

// TODO Replace this entity with `ControlUnitResourceEntity`. It's left for `MissionEntity.units` backward compatibility.
data class LegacyControlUnitResourceEntity(
    val id: Int,
    val name: String,
)
