package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import org.locationtech.jts.geom.Geometry
import java.util.UUID

data class DashboardEntity(
    val id: UUID?,
    val name: String,
    val geom: Geometry,
    val reportings: List<Int>,
    val amps: List<Int>,
    val vigilanceAreas: List<Int>,
    val regulatoryAreas: List<Int>,
    val inseeCode: String?,
)
