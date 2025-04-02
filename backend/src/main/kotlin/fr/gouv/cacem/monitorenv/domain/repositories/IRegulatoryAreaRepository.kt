package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import org.locationtech.jts.geom.Geometry

interface IRegulatoryAreaRepository {
    fun findById(id: Int): RegulatoryAreaEntity?

    fun findAll(): List<RegulatoryAreaEntity>

    fun count(): Long

    fun findAllIdsByGeometry(geometry: Geometry): List<Int>
}
