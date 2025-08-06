package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import org.locationtech.jts.geom.Geometry

interface IAMPRepository {
    fun findAll(withGeometry: Boolean): List<AMPEntity>

    fun count(): Long

    fun findAllIdsByGeometry(geometry: Geometry): List<Int>
}
