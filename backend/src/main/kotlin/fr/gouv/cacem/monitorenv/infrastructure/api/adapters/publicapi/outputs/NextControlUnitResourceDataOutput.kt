package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.entities.port.PortEntity
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService
import fr.gouv.cacem.monitorenv.domain.services.PortService
import fr.gouv.cacem.monitorenv.utils.requireNonNull

data class NextControlUnitResourceDataOutput(
    val id: Int,
    val controlUnit: NextControlUnitEntity,
    val controlUnitId: Int,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    // TODO Make that non-nullable once all resources will have been attached to a port via the frontend resources manager?
    val port: PortEntity? = null,
    val portId: Int? = null,
    // TODO Make that non-nullable once all resources will have been attached to a type via the frontend resources manager?
    val type: NextControlUnitResourceType? = null,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as NextControlUnitResourceDataOutput

        if (id != other.id) return false
        if (name != other.name) return false
        if (note != other.note) return false
        if (photo != null) {
            if (other.photo == null) return false
            if (!photo.contentEquals(other.photo)) return false
        } else if (other.photo != null) return false
        if (port != other.port) return false
        return type == other.type
    }

    companion object {
        fun fromNextControlUnitResourceEntity(
            nextControlUnitResourceEntity: NextControlUnitResourceEntity,
            controlUnitService: ControlUnitService,
            portService: PortService
        ): NextControlUnitResourceDataOutput {
            val controlUnit = controlUnitService.getById(nextControlUnitResourceEntity.controlUnitId)
            val port = nextControlUnitResourceEntity.portId?.let { portService.getById(it) }

            return NextControlUnitResourceDataOutput(
                id = requireNonNull(nextControlUnitResourceEntity.id),
                controlUnit = controlUnit,
                controlUnitId = nextControlUnitResourceEntity.controlUnitId,
                name = nextControlUnitResourceEntity.name,
                note = nextControlUnitResourceEntity.note,
                photo = nextControlUnitResourceEntity.photo,
                port,
                portId = nextControlUnitResourceEntity.portId,
                type = nextControlUnitResourceEntity.type,
            )
        }
    }

    override fun hashCode(): Int {
        var result = id
        result = 31 * result + name.hashCode()
        result = 31 * result + (note?.hashCode() ?: 0)
        result = 31 * result + (photo?.contentHashCode() ?: 0)
        result = 31 * result + (port?.hashCode() ?: 0)
        result = 31 * result + (type?.hashCode() ?: 0)

        return result
    }
}
