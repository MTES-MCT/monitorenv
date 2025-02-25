package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ImageEntity
import io.ktor.util.*
import kotlinx.serialization.Serializable
import java.util.UUID

class DashboardImageDataOutput(
    val id: UUID?,
    val dashboardId: UUID?,
    val name: String,
    @Serializable
    val content: String,
    val mimeType: String,
    val size: Int,
) {
    companion object {
        fun fromDashboardImageEntity(dashboardImage: ImageEntity): DashboardImageDataOutput {
            return DashboardImageDataOutput(
                id = dashboardImage.id,
                dashboardId = dashboardImage.dashboardId,
                name = dashboardImage.name,
                content = dashboardImage.content.encodeBase64(),
                mimeType = dashboardImage.mimeType,
                size = dashboardImage.size,
            )
        }
    }
}
