package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.AxisEnum
import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.SearchFilters
import org.locationtech.jts.geom.Geometry

interface IAMPRepository {
    fun findById(id: Int): AMPEntity?

    fun findAllTiles(
        filters: SearchFilters,
        x: Int,
        y: Int,
        z: Int,
    ): ByteArray

    fun findAll(filters: SearchFilters): List<AMPEntity>

    fun count(): Long

    fun findAllIdsByGeometry(geometry: Geometry): List<Int>

    fun findAllByIds(
        ids: List<Int>,
        axis: AxisEnum,
    ): List<AMPEntity>
}
