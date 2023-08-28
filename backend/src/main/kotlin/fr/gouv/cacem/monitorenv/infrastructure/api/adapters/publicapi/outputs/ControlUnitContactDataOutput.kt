package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.services.ControlUnitService

data class ControlUnitContactDataOutput(
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
            controlUnitContact: ControlUnitContactEntity,
            controlUnitService: ControlUnitService
        ): ControlUnitContactDataOutput {
            val controlUnit =
                controlUnitService.getById(controlUnitContact.controlUnitId)

            return ControlUnitContactDataOutput(
                id = requireNotNull(controlUnitContact.id),
                controlUnit,
                controlUnitId = controlUnitContact.controlUnitId,
                email = controlUnitContact.email,
                name = controlUnitContact.name,
                note = controlUnitContact.note,
                phone = controlUnitContact.phone,
            )
        }
    }
}
