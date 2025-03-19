package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.administration.AdministrationEntity

data class AdministrationDataOutput(
    val id: Int,
    val isArchived: Boolean,
    val name: String,
) {
    companion object {
        fun fromAdministration(administration: AdministrationEntity): AdministrationDataOutput =
            AdministrationDataOutput(
                id = requireNotNull(administration.id),
                isArchived = administration.isArchived,
                name = administration.name,
            )
    }
}
