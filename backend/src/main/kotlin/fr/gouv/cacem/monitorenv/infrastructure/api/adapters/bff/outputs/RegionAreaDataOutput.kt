package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import org.locationtech.jts.geom.MultiPolygon

data class RegionAreaDataOutput(
    val geom: MultiPolygon?,
) {
    companion object {
        fun fromRegionArea(regionArea: MultiPolygon?): RegionAreaDataOutput =
            RegionAreaDataOutput(
                geom = regionArea,
            )
    }
}
