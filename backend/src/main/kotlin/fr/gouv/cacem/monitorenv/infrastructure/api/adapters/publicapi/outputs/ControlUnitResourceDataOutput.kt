package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity

data class ControlUnitResourceDataOutput(
    val id: Int,
    val baseId: Int,
    val controlUnitId: Int,
    val isArchived: Boolean,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    val type: String
) {
    companion object {
        fun fromControlUnitResource(controlUnitResource: ControlUnitResourceEntity): ControlUnitResourceDataOutput {
            return ControlUnitResourceDataOutput(
                id = requireNotNull(controlUnitResource.id),
                baseId = controlUnitResource.baseId,
                controlUnitId = controlUnitResource.controlUnitId,
                isArchived = controlUnitResource.isArchived,
                name = controlUnitResource.name,
                note = controlUnitResource.note,
                photo = controlUnitResource.photo,
                type = controlUnitResource.type.name
            )
        }
    }
}
