package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType

data class FullControlUnitResourceDTO(
    val id: Int? = null,
    val base: BaseEntity,
    val baseId: Int,
    val controlUnit: ControlUnitEntity,
    val controlUnitId: Int,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    val type: ControlUnitResourceType
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as FullControlUnitResourceDTO

        if (id != other.id) return false
        if (base != other.base) return false
        if (baseId != other.baseId) return false
        if (controlUnit != other.controlUnit) return false
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
        result = 31 * result + base.hashCode()
        result = 31 * result + baseId
        result = 31 * result + controlUnit.hashCode()
        result = 31 * result + controlUnitId
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + type.hashCode()
        return result
    }

    fun toControlUnitResource(): ControlUnitResourceEntity {
        return ControlUnitResourceEntity(
            id,
            baseId,
            controlUnitId,
            name,
            note,
            photo,
            type,
        )
    }
}
