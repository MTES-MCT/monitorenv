package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceType
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO

data class FullControlUnitResourceDataOutput(
    val id: Int,
    val base: BaseDataOutput,
    val baseId: Int,
    val controlUnit: ControlUnitDataOutput,
    val controlUnitId: Int,
    val name: String,
    val note: String? = null,
    val photo: ByteArray? = byteArrayOf(),
    val type: ControlUnitResourceType,
) {
    companion object {
        fun fromFullControlUnitResource(fullControlUnitResource: FullControlUnitResourceDTO): FullControlUnitResourceDataOutput {
            val base = BaseDataOutput.fromBase(fullControlUnitResource.base)
            val controlUnit = ControlUnitDataOutput.fromControlUnit(fullControlUnitResource.controlUnit)

            return FullControlUnitResourceDataOutput(
                id = requireNotNull(fullControlUnitResource.controlUnitResource.id),
                base,
                baseId = base.id,
                controlUnit,
                controlUnitId = fullControlUnitResource.controlUnitResource.controlUnitId,
                name = fullControlUnitResource.controlUnitResource.name,
                note = fullControlUnitResource.controlUnitResource.note,
                photo = fullControlUnitResource.controlUnitResource.photo,
                type = fullControlUnitResource.controlUnitResource.type,
            )
        }
    }
}
