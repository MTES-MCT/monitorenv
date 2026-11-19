package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity

data class PropagationConflictDTO(
    /** Regulatory areas whose current value would be overwritten by the group value */
    val regulatoryAreasWithExistingData: List<RegulatoryAreaEntity>,
    val totalRegulatoryAreas: Int,
)
