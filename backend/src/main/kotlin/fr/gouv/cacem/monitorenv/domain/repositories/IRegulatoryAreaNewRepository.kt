package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.v2.RegulatoryAreaEntity

interface IRegulatoryAreaNewRepository {
    fun findAll(
        controlPlan: String? = null,
        query: String? = null,
        seaFronts: List<String>? = null,
        tags: List<Int>? = null,
        themes: List<Int>? = null,
    ): List<RegulatoryAreaEntity>

    fun findAllToComplete(): List<RegulatoryAreaEntity>

    fun findById(id: Int): RegulatoryAreaEntity?

    fun findAllLayerNames(): Map<String, Long>

    fun save(regulatoryArea: RegulatoryAreaEntity): RegulatoryAreaEntity
}
