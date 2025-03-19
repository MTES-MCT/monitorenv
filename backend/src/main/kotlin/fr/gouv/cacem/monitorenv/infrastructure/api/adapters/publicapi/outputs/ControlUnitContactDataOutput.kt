package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity

data class ControlUnitContactDataOutput(
    val id: Int,
    val controlUnitId: Int,
    val email: String?,
    val isEmailSubscriptionContact: Boolean,
    val isSmsSubscriptionContact: Boolean,
    val name: String,
    val phone: String?,
) {
    companion object {
        fun fromControlUnitContact(controlUnitContact: ControlUnitContactEntity): ControlUnitContactDataOutput =
            ControlUnitContactDataOutput(
                id = requireNotNull(controlUnitContact.id),
                controlUnitId = controlUnitContact.controlUnitId,
                email = controlUnitContact.email,
                isEmailSubscriptionContact = controlUnitContact.isEmailSubscriptionContact,
                isSmsSubscriptionContact = controlUnitContact.isSmsSubscriptionContact,
                name = controlUnitContact.name,
                phone = controlUnitContact.phone,
            )
    }
}
