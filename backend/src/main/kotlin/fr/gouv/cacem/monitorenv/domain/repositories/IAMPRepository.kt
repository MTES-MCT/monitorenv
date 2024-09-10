package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.amp.AMPEntity
import org.locationtech.jts.geom.Geometry

interface IAMPRepository {
    fun findAll(): List<AMPEntity>
    fun count(): Long
    fun findAllByGeometry(geometry: Geometry): List<AMPEntity>
}
