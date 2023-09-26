package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO

data class FullControlUnitContactDataOutput(
    val id: Int,
    val controlUnit: ControlUnitEntity,
    val controlUnitId: Int,
    val email: String? = null,
    val name: String,
    val note: String? = null,
    val phone: String? = null,
) {
    companion object {
        fun fromFullControlUnitContact(fullControlUnitContact: FullControlUnitContactDTO): FullControlUnitContactDataOutput {
            return FullControlUnitContactDataOutput(
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
