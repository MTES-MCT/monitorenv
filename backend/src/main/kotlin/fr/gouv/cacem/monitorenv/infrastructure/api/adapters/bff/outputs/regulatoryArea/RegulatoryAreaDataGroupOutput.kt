package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO

data class RegulatoryAreaDataGroupOutput(
    val group: RegulatoryAreaDataOutput,
    val regulatoryAreas: List<RegulatoryAreaDataOutput>,
) {
    companion object {
        fun fromRegulatoryAreaGroup(regulatoryAreaGroup: RegulatoryAreaGroupDTO): RegulatoryAreaDataGroupOutput =
            RegulatoryAreaDataGroupOutput(
                group =
                    RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(
                        regulatoryAreaGroup.group,
                    ),
                regulatoryAreas =
                    regulatoryAreaGroup.areas.map {
                        RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(
                            it,
                        )
                    },
            )
    }
}
