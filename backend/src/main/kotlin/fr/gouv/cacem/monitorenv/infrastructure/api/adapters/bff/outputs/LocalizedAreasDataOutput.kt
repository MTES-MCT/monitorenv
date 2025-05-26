package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.localizedArea.LocalizedAreaEntity
import org.locationtech.jts.geom.MultiPolygon

data class LocalizedAreasDataOutput(
    val id: Int,
    val name: String,
    val geom: MultiPolygon,
    val controlUnitIds: List<Int>? = emptyList(),
    val ampIds: List<Int>? = emptyList(),
) {
    companion object {
        fun fromLocalizedAreaEntity(localizedArea: LocalizedAreaEntity) =
            LocalizedAreasDataOutput(
                id = localizedArea.id,
                name = localizedArea.name,
                geom = localizedArea.geom,
                controlUnitIds = localizedArea.controlUnitIds,
                ampIds = localizedArea.ampIds,
            )
    }
}
