package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.PatchableDataInput

data class CreateOrUpdateControlUnitContactDataInputV2(
    val id: Int?,
    val cellPhone: String?,
    val controlUnitId: Int,
    val email: String?,
    val role: String?,
    val isEmailSubscriptionContact: Boolean,
    val isSmsSubscriptionContact: Boolean,
    val name: String?,
    val phone: String?,
) : PatchableDataInput<CreateOrUpdateControlUnitContactDataInputV2>(
        CreateOrUpdateControlUnitContactDataInputV2::class,
    ) {
    fun toControlUnitContact(): ControlUnitContactEntity =
        ControlUnitContactEntity(
            id = this.id,
            cellPhone = this.cellPhone,
            controlUnitId = this.controlUnitId,
            email = this.email,
            role = this.role,
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
