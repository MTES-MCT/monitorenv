package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO

data class RegulatoryAreaGroupDataOutput(
    val group: RegulatoryAreaDataOutput,
    val regulatoryAreas: List<RegulatoryAreaDataOutput>,
) {
    companion object {
        fun fromRegulatoryAreaGroup(
            regulatoryAreaGroup: RegulatoryAreaGroupDTO,
            withLocationResolution: Boolean = true,
        ): RegulatoryAreaGroupDataOutput =
            RegulatoryAreaGroupDataOutput(
                group =
                    RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(
                        regulatoryAreaGroup.group,
                        withLocationResolution = withLocationResolution,
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
