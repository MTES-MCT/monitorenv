package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.seafront.FacadeEntity
import org.locationtech.jts.geom.Geometry

interface IFacadeAreasRepository {
    fun findFacadeFromGeometry(geometry: Geometry): String?

    fun findAll(): List<FacadeEntity>
}
