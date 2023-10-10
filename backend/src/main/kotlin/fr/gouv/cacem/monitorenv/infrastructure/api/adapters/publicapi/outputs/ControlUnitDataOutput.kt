package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO

data class ControlUnitDataOutput(
    val id: Int,
    val areaNote: String? = null,
    val administrationId: Int,
    val departmentAreaInseeDep: String? = null,
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
                departmentAreaInseeDep = controlUnit.departmentAreaInseeDep,
                isArchived = controlUnit.isArchived,
                name = controlUnit.name,
                termsNote = controlUnit.termsNote,
            )
        }

        fun fromFullControlUnit(fullControlUnit: FullControlUnitDTO): ControlUnitDataOutput {
            return ControlUnitDataOutput(
                id = requireNotNull(fullControlUnit.controlUnit.id),
                areaNote = fullControlUnit.controlUnit.areaNote,
                administrationId = fullControlUnit.controlUnit.administrationId,
                departmentAreaInseeDep = fullControlUnit.controlUnit.departmentAreaInseeDep,
                isArchived = fullControlUnit.controlUnit.isArchived,
                name = fullControlUnit.controlUnit.name,
                termsNote = fullControlUnit.controlUnit.termsNote,
            )
        }
    }
}
