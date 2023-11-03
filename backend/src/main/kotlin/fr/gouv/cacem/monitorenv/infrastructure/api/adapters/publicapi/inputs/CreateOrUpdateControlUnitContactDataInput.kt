package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity

data class CreateOrUpdateControlUnitContactDataInput(
    val id: Int? = null,
    val controlUnitId: Int,
    val email: String? = null,
    val name: String,
    val phone: String? = null,
) {
    fun toControlUnitContact(): ControlUnitContactEntity {
        return ControlUnitContactEntity(
            id = this.id,
            controlUnitId = this.controlUnitId,
            email = this.email,
            name = this.name,
            phone = this.phone,
        )
    }
}
