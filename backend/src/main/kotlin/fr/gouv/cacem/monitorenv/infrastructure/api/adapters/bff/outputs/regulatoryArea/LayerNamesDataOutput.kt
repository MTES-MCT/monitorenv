package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

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
