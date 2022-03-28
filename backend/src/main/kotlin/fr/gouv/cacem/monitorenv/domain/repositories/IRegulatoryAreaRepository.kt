package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity

interface IRegulatoryAreaRepository {
    fun findRegulatoryAreaById(id: Int): RegulatoryAreaEntity
    fun findRegulatoryAreas(): List<RegulatoryAreaEntity>
}
