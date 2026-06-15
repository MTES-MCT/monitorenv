package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.geom.MultiPolygon

interface IDepartmentAreaRepository {
    fun findAll(): List<DepartmentAreaEntity>

    fun findByInseeCode(inseeCode: String): DepartmentAreaEntity

    fun findDepartmentFromGeometry(geometry: Geometry): String?

    fun findRegionFromDepartmentIds(departmentIds: List<String>): MultiPolygon?
}
