package fr.gouv.cacem.monitorenv.domain.entities.amp

import org.locationtech.jts.geom.MultiPolygon

data class AMPEntity(
    val id: Int,
    val designation: String,
    val geom: MultiPolygon?,
    val name: String,
    val refReg: String? = null,
    val type: String? = null,
    val urlLegicem: String? = null,
)
