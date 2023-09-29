package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.base.BaseEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO

data class FullControlUnitResourceDataOutput(
    val id: Int,
    val base: BaseEntity,
    val baseId: Int,
    val controlUnit: ControlUnitEntity,
    val controlUnitId: Int,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    val type: ControlUnitResourceType,
) {
    companion object {
        fun fromFullControlUnitResource(fullControlUnitResource: FullControlUnitResourceDTO): FullControlUnitResourceDataOutput {
            return FullControlUnitResourceDataOutput(
                id = requireNotNull(fullControlUnitResource.controlUnitResource.id),
                base = fullControlUnitResource.base,
                baseId = fullControlUnitResource.controlUnitResource.baseId,
                controlUnit = fullControlUnitResource.controlUnit,
                controlUnitId = fullControlUnitResource.controlUnitResource.controlUnitId,
                name = fullControlUnitResource.controlUnitResource.name,
                note = fullControlUnitResource.controlUnitResource.note,
                photo = fullControlUnitResource.controlUnitResource.photo,
                type = fullControlUnitResource.controlUnitResource.type,
            )
        }
    }
}
