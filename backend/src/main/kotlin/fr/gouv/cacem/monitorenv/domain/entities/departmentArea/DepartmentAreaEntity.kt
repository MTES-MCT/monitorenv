package fr.gouv.cacem.monitorenv.domain.entities.departmentArea

import org.locationtech.jts.geom.MultiPolygon

data class DepartmentAreaEntity(
    /** `inseeCode` is the ID. */
    val inseeCode: String,
    val geometry: MultiPolygon? = null,
    val name: String,
)
