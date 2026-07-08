package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.facades

import fr.gouv.cacem.monitorenv.domain.entities.seafront.FacadeEntity

data class FacadeDataOutput(
    val id: Int,
    val facade: String,
) {
    companion object {
        fun fromSeafront(facade: FacadeEntity) =
            FacadeDataOutput(
                id = facade.id,
                facade = facade.facade,
            )
    }
}
