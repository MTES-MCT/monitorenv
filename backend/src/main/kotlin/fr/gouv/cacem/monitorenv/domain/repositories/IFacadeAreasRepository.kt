package fr.gouv.cacem.monitorenv.domain.repositories

import org.locationtech.jts.geom.Geometry

interface IFacadeAreasRepository {
    fun findFacadeFromGeometry(geometry: Geometry): String?
}
