package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity

data class CreateOrUpdateAdministrationDataInput(
    val id: Int? = null,
    val controlUnitIds: List<Int>,
    val name: String,
) {
    fun toAdministration(): AdministrationEntity {
        return AdministrationEntity(
            id = this.id,
            controlUnitIds = this.controlUnitIds,
            name = this.name,
        )
    }
}
