package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ImageEntity
import kotlinx.serialization.Serializable
import java.util.UUID
import kotlin.io.encoding.Base64

data class ImageDataInput(
    val id: UUID?,
    val name: String,
    @Serializable
    val content: String,
    val mimeType: String,
    val size: Int,
) {
    fun toImageEntity(): ImageEntity =
        ImageEntity(
            id = id,
            name = name,
            content = Base64.decode(content),
            mimeType = mimeType,
            size = size,
        )
}
