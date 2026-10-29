package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity

data class ControlUnitContactDataOutput(
    val id: Int,
    val cellPhone: String?,
    val controlUnitId: Int,
    val email: String?,
    val role: String?,
    val isEmailSubscriptionContact: Boolean,
    val isSmsSubscriptionContact: Boolean,
    val name: String?,
    val phone: String?,
) {
    companion object {
        fun fromControlUnitContact(controlUnitContact: ControlUnitContactEntity): ControlUnitContactDataOutput =
            ControlUnitContactDataOutput(
                id = requireNotNull(controlUnitContact.id),
                cellPhone = controlUnitContact.cellPhone,
                controlUnitId = controlUnitContact.controlUnitId,
                email = controlUnitContact.email,
                role = controlUnitContact.role,
                isEmailSubscriptionContact = controlUnitContact.isEmailSubscriptionContact,
                isSmsSubscriptionContact = controlUnitContact.isSmsSubscriptionContact,
                name = controlUnitContact.name,
                phone = controlUnitContact.phone,
            )
    }
}
