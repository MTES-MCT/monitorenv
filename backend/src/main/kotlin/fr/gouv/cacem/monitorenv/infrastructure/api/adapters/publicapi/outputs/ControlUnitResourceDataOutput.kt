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
}
