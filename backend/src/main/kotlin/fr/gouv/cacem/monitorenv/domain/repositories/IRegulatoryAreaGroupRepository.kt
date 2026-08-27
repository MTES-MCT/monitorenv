package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupWithTotalDTO

interface IRegulatoryAreaGroupRepository {
    fun findGroupById(id: Int): RegulatoryAreaGroupDTO?

    fun findAllLayerNames(): List<RegulatoryAreaGroupWithTotalDTO>

    fun save(regulatoryAreaGroup: RegulatoryAreaGroupEntity): RegulatoryAreaGroupDTO
}
