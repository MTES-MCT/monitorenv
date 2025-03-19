package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import io.ktor.util.*
import kotlinx.serialization.Serializable

@Serializable
data class ImageDataInput(
    val id: Int? = null,
    val name: String,
    val content: String,
    val mimeType: String,
    val size: Int,
) {
    fun toImageEntity(): ImageEntity =
        ImageEntity(
            id = id,
            name = name,
            content = content.decodeBase64Bytes(),
            mimeType = mimeType,
            size = size,
        )
}
