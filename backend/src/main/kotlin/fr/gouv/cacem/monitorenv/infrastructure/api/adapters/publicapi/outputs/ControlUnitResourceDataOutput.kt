package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity

data class ControlUnitResourceDataOutput(
    val id: Int,
    val controlUnitId: Int,
    val isArchived: Boolean,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    val stationId: Int,
    val type: String,
) {
    companion object {
        fun fromControlUnitResource(controlUnitResource: ControlUnitResourceEntity): ControlUnitResourceDataOutput =
            ControlUnitResourceDataOutput(
                id = requireNotNull(controlUnitResource.id),
                controlUnitId = controlUnitResource.controlUnitId,
                isArchived = controlUnitResource.isArchived,
                name = controlUnitResource.name,
                note = controlUnitResource.note,
                photo = controlUnitResource.photo,
                stationId = controlUnitResource.stationId,
                type = controlUnitResource.type.name,
            )
    }
}
