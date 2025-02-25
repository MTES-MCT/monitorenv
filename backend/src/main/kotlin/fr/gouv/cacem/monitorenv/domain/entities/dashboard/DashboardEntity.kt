package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class DashboardEntity(
    val id: UUID?,
    val name: String,
    val geom: Geometry,
    val comments: String?,
    val createdAt: ZonedDateTime?,
    val updatedAt: ZonedDateTime?,
    val isDeleted: Boolean = false,
    val inseeCode: String?,
    val seaFront: String?,
    val ampIds: List<Int>,
    val controlUnitIds: List<Int>,
    val regulatoryAreaIds: List<Int>,
    val reportingIds: List<Int>,
    val vigilanceAreaIds: List<Int>,
    val images: List<ImageEntity>,
    val links: List<LinkEntity>?,
)
