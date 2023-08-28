package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity

interface IRegulatoryAreaRepository {
    fun findById(id: Int): RegulatoryAreaEntity
    fun findAll(): List<RegulatoryAreaEntity>
    fun count(): Long
}
