package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.files.ImageEntity
import kotlinx.serialization.Serializable
import kotlin.io.encoding.Base64

@Serializable
data class ImageDataInput(
    val id: Int?,
    val name: String,
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
