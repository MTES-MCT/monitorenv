package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.nextControlUnit.NextControlUnitAdministrationEntity

data class CreateOrUpdateNextControlUnitAdministrationDataInput(
    val id: Int? = null,
    val controlUnitIds: List<Int>,
    val name: String,
) {
    fun toNextControlUnitAdministrationEntity(): NextControlUnitAdministrationEntity {
        return NextControlUnitAdministrationEntity(
            id = this.id,
            controlUnitIds = this.controlUnitIds,
            name = this.name,
        )
    }
}
