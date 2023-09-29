package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos.FullAdministrationDTO
import fr.gouv.cacem.monitorenv.utils.requireIds

data class FullAdministrationDataOutput(
    val id: Int,
    val controlUnitIds: List<Int>,
    val controlUnits: List<ControlUnitEntity>,
    val isArchived: Boolean,
    val name: String,
) {
    companion object {
        fun fromFullAdministration(fullAdministration: FullAdministrationDTO): FullAdministrationDataOutput {
            return FullAdministrationDataOutput(
                id = requireNotNull(fullAdministration.administration.id),
                controlUnits = fullAdministration.controlUnits,
                controlUnitIds = requireIds(fullAdministration.controlUnits) { it.id },
                isArchived = fullAdministration.administration.isArchived,
                name = fullAdministration.administration.name,
            )
        }
    }
}
