package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos

data class PropagationConflictDTO(
    val regulatoryAreasWithExistingData: Int,
    val totalRegulatoryAreas: Int,
)
