package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO

data class ControlUnitDataOutput(
    val id: Int,
    val areaNote: String? = null,
    val administrationId: Int,
    val departmentAreaInseeCode: String? = null,
    val isArchived: Boolean,
    val name: String,
    val termsNote: String? = null,
) {
    companion object {
        fun fromControlUnit(controlUnit: ControlUnitEntity): ControlUnitDataOutput =
            ControlUnitDataOutput(
                id = requireNotNull(controlUnit.id),
                areaNote = controlUnit.areaNote,
                administrationId = controlUnit.administrationId,
                departmentAreaInseeCode = controlUnit.departmentAreaInseeCode,
                isArchived = controlUnit.isArchived,
                name = controlUnit.name,
                termsNote = controlUnit.termsNote,
            )

        fun fromFullControlUnit(fullControlUnit: FullControlUnitDTO): ControlUnitDataOutput =
            ControlUnitDataOutput(
                id = requireNotNull(fullControlUnit.controlUnit.id),
                areaNote = fullControlUnit.controlUnit.areaNote,
                administrationId = fullControlUnit.controlUnit.administrationId,
                departmentAreaInseeCode = fullControlUnit.controlUnit.departmentAreaInseeCode,
                isArchived = fullControlUnit.controlUnit.isArchived,
                name = fullControlUnit.controlUnit.name,
                termsNote = fullControlUnit.controlUnit.termsNote,
            )
    }
}
