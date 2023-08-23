package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceType

data class CreateOrUpdateNextControlUnitResourceDataInput(
    val id: Int? = null,
    val baseId: Int,
    val controlUnitId: Int,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    val type: NextControlUnitResourceType,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as CreateOrUpdateNextControlUnitResourceDataInput

        if (id != other.id) return false
        if (baseId != other.baseId) return false
        if (controlUnitId != other.controlUnitId) return false
        if (name != other.name) return false
        if (note != other.note) return false
        if (photo != null) {
            if (other.photo == null) return false
            if (!photo.contentEquals(other.photo)) return false
        } else if (other.photo != null) return false
        return type == other.type
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + controlUnitId
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + baseId
        result = 31 * result + type.hashCode()

        return result
    }

    fun toNextControlUnitResourceEntity(): NextControlUnitResourceEntity {
        return NextControlUnitResourceEntity(
            id = this.id,
            baseId = this.baseId,
            controlUnitId = this.controlUnitId,
            name = this.name,
            note = this.note,
            photo = this.photo,
            type = this.type,
        )
    }
}
