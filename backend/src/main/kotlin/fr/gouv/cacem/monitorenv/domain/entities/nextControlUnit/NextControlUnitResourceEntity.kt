package fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit

data class NextControlUnitResourceEntity(
    val id: Int? = null,
    val controlUnitId: Int,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    // TODO Make that non-nullable once all resources will have been attached to a port via the frontend resources manager?
    val portId: Int? = null,
    // TODO Make that non-nullable once all resources will have been attached to a type via the frontend resources manager?
    val type: NextControlUnitResourceType? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as NextControlUnitResourceEntity

        if (id != other.id) return false
        if (controlUnitId != other.controlUnitId) return false
        if (name != other.name) return false
        if (note != other.note) return false
        if (photo != null) {
            if (other.photo == null) return false
            if (!photo.contentEquals(other.photo)) return false
        } else if (other.photo != null) return false
        if (portId != other.portId) return false
        return type == other.type
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + controlUnitId
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + (portId ?: 0)
        result = 31 * result + (type?.hashCode() ?: 0)

        return result
    }
}
