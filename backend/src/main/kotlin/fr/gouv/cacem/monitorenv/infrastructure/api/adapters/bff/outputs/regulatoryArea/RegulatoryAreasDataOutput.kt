package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity

data class RegulatoryAreasDataOutput(
    val group: RegulatoryAreaDataOutput,
    val regulatoryAreas: List<RegulatoryAreaDataOutput>,
) {
    companion object {
        fun fromRegulatoryAreaEntity(
            entry: Map.Entry<RegulatoryAreaEntity, List<RegulatoryAreaEntity>>,
        ): RegulatoryAreasDataOutput =
            RegulatoryAreasDataOutput(
                group = RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(entry.key),
                regulatoryAreas =
                    entry.value.map {
                        RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(it)
                    },
            )
    }
}
