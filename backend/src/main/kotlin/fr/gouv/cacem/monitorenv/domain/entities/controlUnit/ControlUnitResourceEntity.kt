package fr.gouv.cacem.monitorenv.domain.entities.controlUnit

data class ControlUnitResourceEntity(
    val id: Int? = null,
    val baseId: Int,
    val controlUnitId: Int,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    val type: ControlUnitResourceType,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as ControlUnitResourceEntity

        if (id != other.id) return false
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
        result = 31 * result + baseId
        result = 31 * result + controlUnitId
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + type.hashCode()

        return result
    }
}
