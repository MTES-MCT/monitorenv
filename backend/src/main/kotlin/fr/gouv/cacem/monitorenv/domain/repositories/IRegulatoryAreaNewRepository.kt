package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity

interface IRegulatoryAreaNewRepository {
    fun findAll(
        query: String? = null,
        seaFronts: List<String>? = null,
    ): List<RegulatoryAreaNewEntity>

    fun findAllToCreate(): List<RegulatoryAreaNewEntity>

    fun findById(id: Int): RegulatoryAreaNewEntity?

    fun findAllLayerNames(): List<String>

    fun save(regulatoryArea: RegulatoryAreaNewEntity): RegulatoryAreaNewEntity
}
