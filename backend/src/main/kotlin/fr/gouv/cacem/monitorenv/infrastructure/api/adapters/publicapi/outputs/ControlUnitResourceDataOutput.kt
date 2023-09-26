package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType

data class ControlUnitResourceDataOutput(
    val id: Int,
    val baseId: Int? = null,
    val controlUnitId: Int,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    // TODO Make that non-nullable once all resources will have been attached to a type.
    val type: ControlUnitResourceType? = null,
) {
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
    }
}
