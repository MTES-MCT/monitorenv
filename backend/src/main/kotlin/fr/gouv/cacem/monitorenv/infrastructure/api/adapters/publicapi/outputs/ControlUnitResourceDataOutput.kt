package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO

data class ControlUnitResourceDataOutput(
    val id: Int,
    // TODO Make that non-nullable once all resources will have been attached to a base.
    val base: BaseEntity? = null,
    val baseId: Int? = null,
    val controlUnit: ControlUnitEntity? = null,
    val controlUnitId: Int,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    // TODO Make that non-nullable once all resources will have been attached to a type.
    val type: ControlUnitResourceType? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ControlUnitResourceDataOutput

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

    companion object {
        fun fromControlUnitResource(controlUnitResource: ControlUnitResourceEntity): ControlUnitResourceDataOutput {
            return ControlUnitResourceDataOutput(
                id = requireNotNull(controlUnitResource.id),
                baseId = controlUnitResource.baseId,
                controlUnitId = controlUnitResource.controlUnitId,
                name = controlUnitResource.name,
                note = controlUnitResource.note,
                photo = controlUnitResource.photo,
                type = controlUnitResource.type,
            )
        }

        fun fromFullControlUnitResource(fullControlUnitResource: FullControlUnitResourceDTO): ControlUnitResourceDataOutput {
            return ControlUnitResourceDataOutput(
                id = requireNotNull(fullControlUnitResource.id),
                base = fullControlUnitResource.base,
                baseId = fullControlUnitResource.baseId,
                controlUnit = fullControlUnitResource.controlUnit,
                controlUnitId = fullControlUnitResource.controlUnitId,
                name = fullControlUnitResource.name,
                note = fullControlUnitResource.note,
                photo = fullControlUnitResource.photo,
                type = fullControlUnitResource.type,
            )
        }
    }

    override fun hashCode(): Int {
        var result = id
        result = 31 * result + (base?.hashCode() ?: 0)
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + (type?.hashCode() ?: 0)

        return result
    }
}
