package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitContactDTO

data class FullControlUnitContactDataOutput(
    val id: Int,
    val controlUnit: ControlUnitDataOutput,
    val controlUnitId: Int,
    val email: String? = null,
    val name: String,
    val phone: String? = null,
) {
    companion object {
        fun fromFullControlUnitContact(fullControlUnitContact: FullControlUnitContactDTO): FullControlUnitContactDataOutput {
            val controlUnit = ControlUnitDataOutput.fromControlUnit(fullControlUnitContact.controlUnit)

            return FullControlUnitContactDataOutput(
                id = requireNotNull(fullControlUnitContact.controlUnitContact.id),
                controlUnit,
                controlUnitId = controlUnit.id,
                email = fullControlUnitContact.controlUnitContact.email,
                name = fullControlUnitContact.controlUnitContact.name,
                phone = fullControlUnitContact.controlUnitContact.phone,
            )
        }
    }
}
