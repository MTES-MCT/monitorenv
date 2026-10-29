package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity

data class CreateControlUnitContactDataInputV1(
    val id: Int?,
    val cellPhone: String?,
    val controlUnitId: Int,
    val email: String?,
    val role: String?,
    val name: String,
    val phone: String?,
) {
    fun toControlUnitContact(): ControlUnitContactEntity =
        ControlUnitContactEntity(
            id = this.id,
            cellPhone = this.cellPhone,
            controlUnitId = this.controlUnitId,
            email = this.email,
            role = this.role,
            isEmailSubscriptionContact = false,
            isSmsSubscriptionContact = false,
            name = this.name,
            phone = this.phone,
        )
}
