package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.DepartmentAreaDataOutput

data class FullControlUnitDataOutput(
    val id: Int,
    val areaNote: String? = null,
    val administration: AdministrationDataOutput,
    val administrationId: Int,
    val controlUnitContactIds: List<Int>,
    val controlUnitContacts: List<ControlUnitContactDataOutput>,
    val controlUnitResourceIds: List<Int>,
    // `FullControlUnitResourceDataOutput` and not `ControlUnitResourceDataOutput` because we need `base` data for each resource
    val controlUnitResources: List<FullControlUnitResourceDataOutput>,
    val departmentArea: DepartmentAreaDataOutput? = null,
    val departmentAreaInseeCode: String? = null,
    val isArchived: Boolean,
    val name: String,
    val termsNote: String? = null,
) {
    companion object {
        fun fromFullControlUnit(fullControlUnit: FullControlUnitDTO): FullControlUnitDataOutput {
            val administration = AdministrationDataOutput.fromAdministration(fullControlUnit.administration)
            val controlUnitContacts = fullControlUnit.controlUnitContacts.map {
                ControlUnitContactDataOutput.fromControlUnitContact(
                    it,
                )
            }
            val controlUnitResources = fullControlUnit.controlUnitResources.map {
                FullControlUnitResourceDataOutput.fromFullControlUnitResource(it)
            }
            val departmentArea = fullControlUnit.departmentArea?.let { DepartmentAreaDataOutput.fromDepartmentArea(it) }

            return FullControlUnitDataOutput(
                id = requireNotNull(fullControlUnit.controlUnit.id),
                areaNote = fullControlUnit.controlUnit.areaNote,
                administration,
                administrationId = administration.id,
                controlUnitContactIds = controlUnitContacts.map { it.id },
                controlUnitContacts,
                controlUnitResourceIds = controlUnitResources.map { it.id },
                controlUnitResources,
                departmentArea,
                departmentAreaInseeCode = departmentArea?.inseeCode,
                isArchived = fullControlUnit.controlUnit.isArchived,
                name = fullControlUnit.controlUnit.name,
                termsNote = fullControlUnit.controlUnit.termsNote,
            )
        }
    }
}
