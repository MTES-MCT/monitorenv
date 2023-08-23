package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService
import fr.gouv.cacem.monitorenv.domain.services.BaseService
import fr.gouv.cacem.monitorenv.utils.requireNonNull

data class NextControlUnitResourceDataOutput(
    val id: Int,
    // TODO Make that non-nullable once all resources will have been attached to a base.
    val base: BaseEntity? = null,
    val baseId: Int? = null,
    val controlUnit: NextControlUnitEntity,
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

        other as NextControlUnitResourceDataOutput

        if (id != other.id) return false
        if (base != other.base) return false
        if (name != other.name) return false
        if (note != other.note) return false
        if (photo != null) {
            if (other.photo == null) return false
            if (!photo.contentEquals(other.photo)) return false
        } else if (other.photo != null) return false
        return type == other.type
    }

    companion object {
        fun fromNextControlUnitResourceEntity(
            nextControlUnitResourceEntity: NextControlUnitResourceEntity,
            baseService: BaseService,
            controlUnitService: ControlUnitService,
        ): NextControlUnitResourceDataOutput {
            val base = nextControlUnitResourceEntity.baseId?.let { baseService.getById(it) }
            val controlUnit = controlUnitService.getById(nextControlUnitResourceEntity.controlUnitId)

            return NextControlUnitResourceDataOutput(
                id = requireNonNull(nextControlUnitResourceEntity.id),
                base,
                baseId = nextControlUnitResourceEntity.baseId,
                controlUnit,
                controlUnitId = nextControlUnitResourceEntity.controlUnitId,
                name = nextControlUnitResourceEntity.name,
                note = nextControlUnitResourceEntity.note,
                photo = nextControlUnitResourceEntity.photo,
                type = nextControlUnitResourceEntity.type,
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
