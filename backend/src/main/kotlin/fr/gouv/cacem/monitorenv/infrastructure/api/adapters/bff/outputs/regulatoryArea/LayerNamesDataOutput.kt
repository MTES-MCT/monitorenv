package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

data class LayerNamesDataOutput(
    val layerNames: List<String>,
) {
    companion object {
        fun fromGroupNames(layerNames: List<String>) =
            LayerNamesDataOutput(
                layerNames = layerNames,
            )
    }
}
