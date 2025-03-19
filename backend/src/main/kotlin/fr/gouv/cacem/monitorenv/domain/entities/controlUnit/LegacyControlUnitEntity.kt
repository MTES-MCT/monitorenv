package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

// TODO Replace this entity with `ControlUnitEntity`. It's left for `MissionEntity.units` backward compatibility.
data class LegacyControlUnitEntity(
    val id: Int,
    val administration: String,
    val isArchived: Boolean,
    val name: String,
    val resources: List<LegacyControlUnitResourceEntity>,
    val contact: String? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as LegacyControlUnitEntity

        return id == other.id
    }

    override fun hashCode(): Int = id
}
