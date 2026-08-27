package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryAreas

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupWithTotalDTO

data class LayerNamesDataOutput(
    val total: Int,
    val group: RegulatoryAreaDataOutput,
) {
    companion object {
        fun fromGroupNames(regulatoryAreasGroupWithTotal: RegulatoryAreaGroupWithTotalDTO) =
            LayerNamesDataOutput(
                group = RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(regulatoryAreasGroupWithTotal.group),
                total = regulatoryAreasGroupWithTotal.total,
            )
    }
}
