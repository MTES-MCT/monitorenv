package fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity

data class RegulatoryAreaGroupDTO(
    val areas: List<RegulatoryAreaEntity>,
    val group: RegulatoryAreaEntity,
)
