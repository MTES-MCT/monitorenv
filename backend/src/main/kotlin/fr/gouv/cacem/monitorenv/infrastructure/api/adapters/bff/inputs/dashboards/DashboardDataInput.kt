package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.LinkEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

class DashboardDataInput(
    val id: UUID?,
    val name: String,
    val geom: Geometry,
    val createdAt: ZonedDateTime?,
    val updatedAt: ZonedDateTime?,
    val comments: String?,
    val inseeCode: String?,
    val ampIds: List<Int>,
    val controlUnitIds: List<Int>,
    val regulatoryAreaIds: List<Int>,
    val reportingIds: List<Int>,
    val vigilanceAreaIds: List<Int>,
    val links: List<LinkEntity>,
    val images: List<ImageDataInput>,
) {
    fun toDashboardEntity(): DashboardEntity =
        DashboardEntity(
            id = id,
            name = name,
            geom = geom,
            comments = comments,
            createdAt = createdAt,
            updatedAt = updatedAt,
            inseeCode = inseeCode,
            ampIds = ampIds,
            controlUnitIds = controlUnitIds,
            reportingIds = reportingIds,
            regulatoryAreaIds = regulatoryAreaIds,
            vigilanceAreaIds = vigilanceAreaIds,
            seaFront = null,
            links = links,
            images = images.map { it.toImageEntity() },
        )
}
