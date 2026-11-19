package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryAreas

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.PropagationConflictDTO

data class PropagationConflictDataOutput(
    val regulatoryAreasWithExistingData: List<RegulatoryAreaDataOutput>,
    val totalRegulatoryAreas: Int,
) {
    companion object {
        fun fromPropagationConflictDTO(conflict: PropagationConflictDTO) =
            PropagationConflictDataOutput(
                regulatoryAreasWithExistingData =
                    conflict.regulatoryAreasWithExistingData.map {
                        RegulatoryAreaDataOutput.fromRegulatoryAreaEntity(it, withGeom = false)
                    },
                totalRegulatoryAreas = conflict.totalRegulatoryAreas,
            )
    }
}
