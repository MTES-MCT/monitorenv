package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import io.ktor.util.*
import kotlinx.serialization.Serializable

@Serializable
class VigilanceAreaImageDataOutput(
    val id: Int?,
    val name: String,
    val content: String,
    val mimeType: String,
    val size: Int,
) {
    companion object {
        fun fromVigilanceAreaImage(vigilanceAreaImage: ImageEntity): VigilanceAreaImageDataOutput =
            VigilanceAreaImageDataOutput(
                id = vigilanceAreaImage.id,
                name = vigilanceAreaImage.name,
                content = vigilanceAreaImage.content.encodeBase64(),
                mimeType = vigilanceAreaImage.mimeType,
                size = vigilanceAreaImage.size,
            )
    }
}
