package fr.gouv.cacem.monitorenv.domain.entities.departmentArea

import org.locationtech.jts.geom.MultiPolygon

data class DepartmentAreaEntity(
    /** `inseeDep` is the ID. */
    val inseeDep: String,
    val geometry: MultiPolygon? = null,
    val name: String,
)
