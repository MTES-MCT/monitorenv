package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitResourceDTO

data class FullControlUnitDataOutput(
    val id: Int,
    val areaNote: String? = null,
    val administration: AdministrationEntity,
    val administrationId: Int,
    val controlUnitContactIds: List<Int>,
    val controlUnitContacts: List<ControlUnitContactEntity>,
    val controlUnitResourceIds: List<Int>,
    // `FullControlUnitResourceDTO` and not `ControlUnitResourceEntity` because we need `base` data for each resource
    val controlUnitResources: List<FullControlUnitResourceDTO>,
    val isArchived: Boolean,
    val name: String,
    val termsNote: String? = null,
) {
    companion object {
        fun fromFullControlUnit(fullControlUnit: FullControlUnitDTO): FullControlUnitDataOutput {
            return FullControlUnitDataOutput(
                id = requireNotNull(fullControlUnit.id),
                areaNote = fullControlUnit.areaNote,
                administration = fullControlUnit.administration,
                administrationId = fullControlUnit.administrationId,
                controlUnitContactIds = fullControlUnit.controlUnitContactIds,
                controlUnitContacts = fullControlUnit.controlUnitContacts,
                controlUnitResourceIds = fullControlUnit.controlUnitResourceIds,
                controlUnitResources = fullControlUnit.controlUnitResources,
                isArchived = fullControlUnit.isArchived,
                name = fullControlUnit.name,
                termsNote = fullControlUnit.termsNote,
            )
        }
    }
}
