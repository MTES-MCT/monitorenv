package fr.gouv.cacem.monitorenv.domain.entities.localizedArea

import org.locationtech.jts.geom.MultiPolygon

data class LocalizedAreaEntity(
    val id: Int,
    val geom: MultiPolygon,
    val name: String,
    val controlUnitIds: List<Int>? = emptyList(),
    val ampIds: List<Int>? = emptyList(),
)
