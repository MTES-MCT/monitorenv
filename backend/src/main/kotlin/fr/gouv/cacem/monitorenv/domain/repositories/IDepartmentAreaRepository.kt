package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.departmentArea.DepartmentAreaEntity
import org.locationtech.jts.geom.Geometry

interface IDepartmentAreaRepository {
    fun findAll(): List<DepartmentAreaEntity>

    fun findByInseeDep(inseeDep: String): DepartmentAreaEntity

    fun findDepartmentFromGeometry(geometry: Geometry): String?
}
