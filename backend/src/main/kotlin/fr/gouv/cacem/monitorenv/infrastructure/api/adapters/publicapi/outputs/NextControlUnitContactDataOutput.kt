package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService
import fr.gouv.cacem.monitorenv.utils.requireNonNull

data class NextControlUnitContactDataOutput(
    val id: Int,
    val controlUnit: NextControlUnitEntity,
    val controlUnitId: Int,
    val email: String? = null,
    val name: String,
    val note: String? = null,
    val phone: String? = null,
) {
    companion object {
        fun fromNextControlUnitContactEntity(
            nextControlUnitContactEntity: NextControlUnitContactEntity,
            controlUnitService: ControlUnitService
        ): NextControlUnitContactDataOutput {
            val controlUnit =
                controlUnitService.getById(nextControlUnitContactEntity.controlUnitId)

            return NextControlUnitContactDataOutput(
                id = requireNonNull(nextControlUnitContactEntity.id),
                controlUnit,
                controlUnitId = nextControlUnitContactEntity.controlUnitId,
                email = nextControlUnitContactEntity.email,
                name = nextControlUnitContactEntity.name,
                note = nextControlUnitContactEntity.note,
                phone = nextControlUnitContactEntity.phone,
            )
        }
    }
}
