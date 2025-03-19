package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType

data class CreateOrUpdateControlUnitResourceDataInput(
    val id: Int? = null,
    val controlUnitId: Int,
    val isArchived: Boolean,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    val stationId: Int,
    val type: ControlUnitResourceType,
) {
    fun toControlUnitResource(): ControlUnitResourceEntity =
        ControlUnitResourceEntity(
            id = this.id,
            controlUnitId = this.controlUnitId,
            isArchived = this.isArchived,
            name = this.name,
            note = this.note,
            photo = this.photo,
            stationId = this.stationId,
            type = this.type,
        )
}
