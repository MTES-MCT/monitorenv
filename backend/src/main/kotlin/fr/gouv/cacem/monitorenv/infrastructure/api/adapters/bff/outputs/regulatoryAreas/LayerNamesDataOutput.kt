package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryAreas

data class LayerNamesDataOutput(
    val layerNames: Map<String, Long>,
) {
    companion object {
        fun fromGroupNames(layerNames: Map<String, Long>) =
            LayerNamesDataOutput(
                layerNames = layerNames,
            )
    }
}
