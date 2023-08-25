package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity

data class CreateOrUpdateControlUnitContactDataInput(
    val id: Int? = null,
    val controlUnitId: Int,
    val email: String? = null,
    val name: String,
    val note: String? = null,
    val phone: String? = null,
) {
    fun toNextControlUnitContactEntity(): ControlUnitContactEntity {
        return ControlUnitContactEntity(
            id = this.id,
            controlUnitId = this.controlUnitId,
            email = this.email,
            name = this.name,
            note = this.note,
            phone = this.phone,
        )
    }
}
