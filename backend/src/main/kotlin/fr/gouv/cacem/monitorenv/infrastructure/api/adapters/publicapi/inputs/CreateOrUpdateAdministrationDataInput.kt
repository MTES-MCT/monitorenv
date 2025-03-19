package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity

data class CreateOrUpdateAdministrationDataInput(
    val id: Int? = null,
    val isArchived: Boolean,
    val name: String,
) {
    fun toAdministration(): AdministrationEntity =
        AdministrationEntity(
            id = this.id,
            isArchived = this.isArchived,
            name = this.name,
        )
}
