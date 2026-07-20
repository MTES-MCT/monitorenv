package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.facades

import fr.gouv.cacem.monitorenv.domain.entities.seafront.SeaFrontEntity

data class SeaFrontDataOutput(
    val id: Int,
    val facade: String,
) {
    companion object {
        fun fromSeafront(seaFront: SeaFrontEntity) =
            SeaFrontDataOutput(
                id = seaFront.id,
                facade = seaFront.facade,
            )
    }
}
