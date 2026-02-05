package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity

interface IRegulatoryAreaNewRepository {
    fun findAll(): List<RegulatoryAreaNewEntity>
}
