package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.seafront.SeaFrontEntity
import org.locationtech.jts.geom.Geometry

interface ISeaFrontRepository {
    fun findSeaFrontFromGeometry(geometry: Geometry): String?

    fun findAll(): List<SeaFrontEntity>
}
