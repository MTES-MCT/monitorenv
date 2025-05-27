package fr.gouv.cacem.monitorenv.domain.entities.localizedArea

import org.locationtech.jts.geom.MultiPolygon

data class LocalizedAreaEntity(
    val id: Int,
    val ampIds: List<Int>? = emptyList(),
    val controlUnitIds: List<Int>? = emptyList(),
    val geom: MultiPolygon,
    val groupName: String,
    val name: String,
)
