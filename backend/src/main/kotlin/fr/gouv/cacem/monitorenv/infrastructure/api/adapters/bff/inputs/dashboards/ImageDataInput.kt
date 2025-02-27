package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ImageEntity
import io.ktor.util.*
import kotlinx.serialization.Serializable
import java.util.UUID

data class ImageDataInput(
    val id: UUID?,
    val name: String,
    @Serializable
    val content: String,
    val mimeType: String,
    val size: Int,
) {
    fun toImageEntity(): ImageEntity {
        return ImageEntity(
            id = id,
            name = name,
            content = content.decodeBase64Bytes(),
            mimeType = mimeType,
            size = size,
        )
    }
}
