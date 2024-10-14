package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class DashboardEntity(
    val id: UUID?,
    val name: String,
    val geom: Geometry,
    val comments: String?,
    val createdAt: ZonedDateTime?,
    val updatedAt: ZonedDateTime?,
    val inseeCode: String?,
    val facade: String?,
    val amps: List<Int>,
    val controlUnits: List<Int>,
    val regulatoryAreas: List<Int>,
    val reportings: List<Int>,
    val vigilanceAreas: List<Int>,
)
