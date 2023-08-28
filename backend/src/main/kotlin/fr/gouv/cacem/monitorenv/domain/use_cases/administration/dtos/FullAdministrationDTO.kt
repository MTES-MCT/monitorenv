package fr.gouv.cacem.monitorenv.domain.use_cases.administration.dtos

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.NextControlUnitEntity

class FullAdministrationDTO(
    val id: Int? = null,
    val controlUnitIds: List<Int>,
    val controlUnits: List<NextControlUnitEntity>,
    val name: String,
) {
    fun toAdministration(): AdministrationEntity {
        return AdministrationEntity(
            id,
            controlUnitIds,
            name,
        )
    }
}
