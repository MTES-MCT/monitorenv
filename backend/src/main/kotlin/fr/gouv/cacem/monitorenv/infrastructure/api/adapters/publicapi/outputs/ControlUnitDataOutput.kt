package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO

data class ControlUnitDataOutput(
    val id: Int,
    val areaNote: String? = null,
    val administration: AdministrationEntity? = null,
    val administrationId: Int,
    val controlUnitContactIds: List<Int>,
    val controlUnitContacts: List<ControlUnitContactEntity>? = null,
    val controlUnitResourceIds: List<Int>,
    val controlUnitResources: List<ControlUnitResourceEntity>? = null,
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
                controlUnitContactIds = controlUnit.controlUnitContactIds,
                controlUnitResourceIds = controlUnit.controlUnitResourceIds,
                isArchived = controlUnit.isArchived,
                name = controlUnit.name,
                termsNote = controlUnit.termsNote,
            )
        }

        fun fromFullControlUnit(fullControlUnit: FullControlUnitDTO): ControlUnitDataOutput {
            return ControlUnitDataOutput(
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
