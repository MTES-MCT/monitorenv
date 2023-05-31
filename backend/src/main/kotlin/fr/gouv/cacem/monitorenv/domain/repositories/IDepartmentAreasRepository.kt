package fr.gouv.cacem.monitorenv.domain.repositories

import org.locationtech.jts.geom.Geometry

interface IDepartmentAreasRepository {
    fun findDepartmentFromGeometry(missionGeometry: Geometry): String?
}
