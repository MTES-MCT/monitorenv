package fr.gouv.cacem.monitorenv.domain.entities.amp

import org.locationtech.jts.geom.MultiPolygon

data class AMPEntity(
    val id: Int,
    val designation: String,
    val geom: MultiPolygon,
    val name: String,
    val ref_reg: String? = null,
    val type: String? = null,
    val url_legicem: String? = null,
)
