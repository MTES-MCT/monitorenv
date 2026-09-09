package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryAreas

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO

data class RegulatoryAreasDataOutput(
    val group: RegulatoryAreaDataOutput,
    val regulatoryAreas: List<RegulatoryAreaDataOutput>,
) {
    companion object {
        fun fromRegulatoryAreaGroupDTO(regulatoryAreaGroup: RegulatoryAreaGroupDTO): RegulatoryAreasDataOutput =
            RegulatoryAreasDataOutput(
                group = RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(regulatoryAreaGroup.group),
                regulatoryAreas =
                    regulatoryAreaGroup.areas.map {
                        RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(it)
                    },
            )
    }
}
