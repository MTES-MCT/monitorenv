package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.PatchableDataInput

data class CreateOrUpdateControlUnitContactDataInputV2(
    val id: Int?,
    val controlUnitId: Int,
    val email: String?,
    val isEmailSubscriptionContact: Boolean,
    val isSmsSubscriptionContact: Boolean,
    val name: String,
    val phone: String?,
) : PatchableDataInput<CreateOrUpdateControlUnitContactDataInputV2>(
        CreateOrUpdateControlUnitContactDataInputV2::class,
    ) {
    fun toControlUnitContact(): ControlUnitContactEntity =
        ControlUnitContactEntity(
            id = this.id,
            controlUnitId = this.controlUnitId,
            email = this.email,
            isEmailSubscriptionContact = this.isEmailSubscriptionContact,
            isSmsSubscriptionContact = this.isSmsSubscriptionContact,
            name = this.name,
            phone = this.phone,
        )

    companion object {
        fun fromControlUnitContact(
            controlUnitContact: ControlUnitContactEntity,
        ): CreateOrUpdateControlUnitContactDataInputV2 =
            CreateOrUpdateControlUnitContactDataInputV2(
                id = controlUnitContact.id,
                controlUnitId = controlUnitContact.controlUnitId,
                email = controlUnitContact.email,
                isEmailSubscriptionContact = controlUnitContact.isEmailSubscriptionContact,
                isSmsSubscriptionContact = controlUnitContact.isSmsSubscriptionContact,
                name = controlUnitContact.name,
                phone = controlUnitContact.phone,
            )
    }
}
