package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryAreas

import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.PropagationConflictDTO

data class PropagationConflictDataOutput(
    val regulatoryAreasWithExistingData: Int,
    val totalRegulatoryAreas: Int,
) {
    companion object {
        fun fromPropagationConflictDTO(conflict: PropagationConflictDTO) =
            PropagationConflictDataOutput(
                regulatoryAreasWithExistingData = conflict.regulatoryAreasWithExistingData,
                totalRegulatoryAreas = conflict.totalRegulatoryAreas,
            )
    }
}
