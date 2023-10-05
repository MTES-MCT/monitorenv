package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity

data class ControlUnitContactDataOutput(
    val id: Int,
    val controlUnitId: Int,
    val email: String? = null,
    val name: String,
    val phone: String? = null,
) {
    companion object {
        fun fromControlUnitContact(controlUnitContact: ControlUnitContactEntity): ControlUnitContactDataOutput {
            return ControlUnitContactDataOutput(
                id = requireNotNull(controlUnitContact.id),
                controlUnitId = controlUnitContact.controlUnitId,
                email = controlUnitContact.email,
                name = controlUnitContact.name,
                phone = controlUnitContact.phone,
            )
        }
    }
}
