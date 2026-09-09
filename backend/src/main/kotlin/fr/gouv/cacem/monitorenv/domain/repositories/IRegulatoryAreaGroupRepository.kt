package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.regulatoryAreas.dtos.RegulatoryAreaGroupWithTotalDTO

interface IRegulatoryAreaGroupRepository {
    fun findAll(
        controlPlan: String? = null,
        query: String? = null,
        seaFronts: List<String>? = null,
        tags: List<Int>? = null,
        themes: List<Int>? = null,
        onlyRecentsAreas: Boolean? = false,
    ): List<RegulatoryAreaGroupDTO>

    fun findGroupById(id: Int): RegulatoryAreaGroupDTO?

    fun findAllLayerNames(): List<RegulatoryAreaGroupWithTotalDTO>

    fun save(regulatoryAreaGroup: RegulatoryAreaGroupEntity): RegulatoryAreaGroupDTO
}
