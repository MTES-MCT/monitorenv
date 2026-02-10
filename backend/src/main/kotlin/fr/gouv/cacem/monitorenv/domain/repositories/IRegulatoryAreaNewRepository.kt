package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity

interface IRegulatoryAreaNewRepository {
    fun findAll(
        groupBy: String? = null,
        query: String? = null,
        seaFronts: List<String>? = null,
    ): List<RegulatoryAreaNewEntity>

    fun findById(id: Int): RegulatoryAreaNewEntity?

    fun findAllLayerNames(): List<String>

    fun save(regulatoryArea: RegulatoryAreaNewEntity): RegulatoryAreaNewEntity
}
