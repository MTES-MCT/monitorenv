package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity

interface IRegulatoryAreaRepository {
    fun findById(id: Int): RegulatoryAreaEntity
    fun findAll(): List<RegulatoryAreaEntity>
    fun count(): Long
}
