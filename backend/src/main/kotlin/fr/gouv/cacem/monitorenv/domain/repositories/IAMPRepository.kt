package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import org.locationtech.jts.geom.Geometry

interface IAMPRepository {
    fun findAll(
        withGeometry: Boolean,
        zoom: Int? = null,
        bbox: List<Double>? = null,
    ): List<AMPEntity>

    fun count(): Long

    fun findAllIdsByGeometry(geometry: Geometry): List<Int>

    fun findAllByIds(ids: List<Int>): List<AMPEntity>

    fun findById(id: Int): AMPEntity?
}
