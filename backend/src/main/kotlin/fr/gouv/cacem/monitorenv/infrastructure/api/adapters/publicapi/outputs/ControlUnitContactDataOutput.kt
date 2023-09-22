package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO

data class ControlUnitContactDataOutput(
    val id: Int,
    val controlUnit: ControlUnitEntity? = null,
    val controlUnitId: Int,
    val email: String? = null,
    val name: String,
    val note: String? = null,
    val phone: String? = null,
) {
    companion object {
        fun fromControlUnitContact(controlUnitContact: ControlUnitContactEntity): ControlUnitContactDataOutput {
            return ControlUnitContactDataOutput(
                id = requireNotNull(controlUnitContact.id),
                controlUnitId = controlUnitContact.controlUnitId,
                email = controlUnitContact.email,
                name = controlUnitContact.name,
                note = controlUnitContact.note,
                phone = controlUnitContact.phone,
            )
        }

        fun fromFullControlUnitContact(fullControlUnitContact: FullControlUnitContactDTO): ControlUnitContactDataOutput {
            return ControlUnitContactDataOutput(
                id = requireNotNull(fullControlUnitContact.id),
                controlUnit = fullControlUnitContact.controlUnit,
                controlUnitId = fullControlUnitContact.controlUnitId,
                email = fullControlUnitContact.email,
                name = fullControlUnitContact.name,
                note = fullControlUnitContact.note,
                phone = fullControlUnitContact.phone,
            )
        }
    }
}
