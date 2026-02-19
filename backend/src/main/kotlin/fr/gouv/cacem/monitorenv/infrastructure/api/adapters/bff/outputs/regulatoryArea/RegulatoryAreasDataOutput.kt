package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity

data class RegulatoryAreasDataOutput(
    val group: String,
    val regulatoryAreas: List<RegulatoryAreaDataOutput>,
) {
    companion object {
        fun fromRegulatoryAreaEntity(
            entry: Map.Entry<String?, List<RegulatoryAreaNewEntity>>,
        ): RegulatoryAreasDataOutput =
            RegulatoryAreasDataOutput(
                group = entry.key ?: "UNKNOWN",
                regulatoryAreas =
                    entry.value.map {
                        RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(it)
                    },
            )
    }
}
