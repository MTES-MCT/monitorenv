package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import org.locationtech.jts.geom.Geometry

interface IRegulatoryAreaRepository {
    fun findAll(filters: SearchFilters): List<RegulatoryAreaEntity>

    fun findAllTiles(
        filters: SearchFilters?,
        x: Int,
        y: Int,
        z: Int,
    ): ByteArray

    fun findAllIdsByGeometry(geometry: Geometry): List<Int>

    fun findAllByIds(
        ids: List<Int>,
        axis: AxisEnum,
    ): List<RegulatoryAreaEntity>

    fun findAllToComplete(): List<RegulatoryAreaEntity>

    fun findById(id: Int): RegulatoryAreaEntity?

    fun findAllLayerNames(): Map<String, Long>

    fun save(regulatoryArea: RegulatoryAreaEntity): RegulatoryAreaEntity

    fun count(): Long
}
