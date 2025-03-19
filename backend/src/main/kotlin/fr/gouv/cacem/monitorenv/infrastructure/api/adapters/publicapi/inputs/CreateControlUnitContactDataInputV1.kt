package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity

data class CreateControlUnitContactDataInputV1(
    val id: Int?,
    val controlUnitId: Int,
    val email: String?,
    val name: String,
    val phone: String?,
) {
    fun toControlUnitContact(): ControlUnitContactEntity =
        ControlUnitContactEntity(
            id = this.id,
            controlUnitId = this.controlUnitId,
            email = this.email,
            isEmailSubscriptionContact = false,
            isSmsSubscriptionContact = false,
            name = this.name,
            phone = this.phone,
        )
}
