package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO

data class ControlUnitDataOutput(
    val id: Int,
    val areaNote: String? = null,
    val administrationId: Int,
    val department: String,
    val isArchived: Boolean,
    val name: String,
    val seaFront: String,
    val termsNote: String? = null,
) {
    companion object {
        fun fromControlUnit(controlUnit: ControlUnitEntity): ControlUnitDataOutput {
            return ControlUnitDataOutput(
                id = requireNotNull(controlUnit.id),
                areaNote = controlUnit.areaNote,
                administrationId = controlUnit.administrationId,
                department = controlUnit.department,
                isArchived = controlUnit.isArchived,
                name = controlUnit.name,
                seaFront = controlUnit.seaFront.name,
                termsNote = controlUnit.termsNote,
            )
        }

        fun fromFullControlUnit(fullControlUnit: FullControlUnitDTO): ControlUnitDataOutput {
            return ControlUnitDataOutput(
                id = requireNotNull(fullControlUnit.controlUnit.id),
                areaNote = fullControlUnit.controlUnit.areaNote,
                administrationId = fullControlUnit.controlUnit.administrationId,
                department = fullControlUnit.controlUnit.department,
                isArchived = fullControlUnit.controlUnit.isArchived,
                name = fullControlUnit.controlUnit.name,
                seaFront = fullControlUnit.controlUnit.seaFront.name,
                termsNote = fullControlUnit.controlUnit.termsNote,
            )
        }
    }
}
