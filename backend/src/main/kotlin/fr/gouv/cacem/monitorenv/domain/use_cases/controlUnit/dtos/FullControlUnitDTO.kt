package fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitContactEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.ControlUnitResourceEntity

data class FullControlUnitDTO(
    val id: Int? = null,
    val administration: AdministrationEntity,
    val administrationId: Int,
    /** Area of intervention for this unit. */
    val areaNote: String? = null,
    val controlUnitContactIds: List<Int>,
    val controlUnitContacts: List<ControlUnitContactEntity>,
    val controlUnitResourceIds: List<Int>,
    val controlUnitResources: List<ControlUnitResourceEntity>,
    val isArchived: Boolean,
    val name: String,
    /** Conditions under which this unit should be contacted. */
    val termsNote: String? = null,
) {
    fun toControlUnit(): ControlUnitEntity {
        return ControlUnitEntity(
            id,
            administrationId,
            areaNote,
            controlUnitContactIds,
            controlUnitResourceIds,
            isArchived,
            name,
            termsNote,
        )
    }
}
