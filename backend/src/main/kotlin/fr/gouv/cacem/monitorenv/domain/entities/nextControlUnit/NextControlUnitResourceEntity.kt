package fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity

data class NextControlUnitResourceEntity(
    val id: Int? = null,
    // Only used for deep resolution of the base attached to each control unit resource when outputting control units.
    val base: BaseEntity? = null,
    // TODO Make that non-nullable once all resources will have been attached to a base.
    val baseId: Int? = null,
    val controlUnitId: Int,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    // TODO Make that non-nullable once all resources will have been attached to a type.
    val type: NextControlUnitResourceType? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as NextControlUnitResourceEntity

        if (id != other.id) return false
        if (base != other.base) return false
        if (baseId != other.baseId) return false
        if (controlUnitId != other.controlUnitId) return false
        if (name != other.name) return false
        if (note != other.note) return false
        if (photo != null) {
            if (other.photo == null) return false
            if (!photo.contentEquals(other.photo)) return false
        } else if (other.photo != null) return false
        if (type != other.type) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + (base?.hashCode() ?: 0)
        result = 31 * result + (baseId ?: 0)
        result = 31 * result + controlUnitId
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + (type?.hashCode() ?: 0)

        return result
    }
}
