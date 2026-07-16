package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO

interface IRegulatoryAreaGroupRepository {
    fun findGroupById(id: Int): RegulatoryAreaGroupDTO?

    fun findAllLayerNames(): Map<String, Long>

    fun save(regulatoryAreaGroup: RegulatoryAreaGroupEntity): RegulatoryAreaGroupDTO
}
