package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.administrations

import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlUnits.ControlUnitDataOutput

data class FullAdministrationDataOutput(
    val id: Int,
    val controlUnitIds: List<Int>,
    val controlUnits: List<ControlUnitDataOutput>,
    val isArchived: Boolean,
    val name: String,
) {
    companion object {
        fun fromFullAdministration(fullAdministration: FullAdministrationDTO): FullAdministrationDataOutput {
            val controlUnits = fullAdministration.controlUnits.map { ControlUnitDataOutput.fromControlUnit(it) }

            return FullAdministrationDataOutput(
                id = requireNotNull(fullAdministration.administration.id),
                controlUnitIds = controlUnits.map { it.id },
                controlUnits,
                isArchived = fullAdministration.administration.isArchived,
                name = fullAdministration.administration.name,
            )
        }
    }
}
