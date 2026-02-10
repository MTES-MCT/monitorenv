package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

data class RegulatoryAreasLayerNamesDataOutput(
    val layerNames: List<String>,
) {
    companion object {
        fun fromGroupNames(layerNames: List<String>) =
            RegulatoryAreasLayerNamesDataOutput(
                layerNames = layerNames,
            )
    }
}
