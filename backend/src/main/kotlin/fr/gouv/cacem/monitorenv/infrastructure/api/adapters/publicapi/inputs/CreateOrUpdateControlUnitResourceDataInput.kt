package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType

data class CreateOrUpdateControlUnitResourceDataInput(
    val id: Int? = null,
    val baseId: Int,
    val controlUnitId: Int,
    val isArchived: Boolean,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    val type: ControlUnitResourceType
) {
    fun toControlUnitResource(): ControlUnitResourceEntity {
        return ControlUnitResourceEntity(
            id = this.id,
            baseId = this.baseId,
            controlUnitId = this.controlUnitId,
            isArchived = this.isArchived,
            name = this.name,
            note = this.note,
            photo = this.photo,
            type = this.type
        )
    }
}
