package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.localizedArea.LocalizedAreaEntity
import org.locationtech.jts.geom.MultiPolygon

data class LocalizedAreasDataOutput(
    val id: Int,
    val ampIds: List<Int>? = emptyList(),
    val controlUnitIds: List<Int>? = emptyList(),
    val geom: MultiPolygon,
    val groupName: String,
    val name: String,
) {
    companion object {
        fun fromLocalizedAreaEntity(localizedArea: LocalizedAreaEntity) =
            LocalizedAreasDataOutput(
                id = localizedArea.id,
                ampIds = localizedArea.ampIds,
                controlUnitIds = localizedArea.controlUnitIds,
                geom = localizedArea.geom,
                groupName = localizedArea.groupName,
                name = localizedArea.name,
            )
    }
}
