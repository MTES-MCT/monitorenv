package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO

data class ControlUnitDataOutput(
    val id: Int,
    val areaNote: String? = null,
    val administrationId: Int,
    val isArchived: Boolean,
    val name: String,
    val termsNote: String? = null,
) {
    companion object {
        fun fromControlUnit(controlUnit: ControlUnitEntity): ControlUnitDataOutput {
            return ControlUnitDataOutput(
                id = requireNotNull(controlUnit.id),
                areaNote = controlUnit.areaNote,
                administrationId = controlUnit.administrationId,
                isArchived = controlUnit.isArchived,
                name = controlUnit.name,
                termsNote = controlUnit.termsNote,
            )
        }

        fun fromFullControlUnit(fullControlUnit: FullControlUnitDTO): ControlUnitDataOutput {
            return ControlUnitDataOutput(
                id = requireNotNull(fullControlUnit.id),
                areaNote = fullControlUnit.areaNote,
                administrationId = fullControlUnit.administrationId,
                isArchived = fullControlUnit.isArchived,
                name = fullControlUnit.name,
                termsNote = fullControlUnit.termsNote,
            )
        }
    }
}
