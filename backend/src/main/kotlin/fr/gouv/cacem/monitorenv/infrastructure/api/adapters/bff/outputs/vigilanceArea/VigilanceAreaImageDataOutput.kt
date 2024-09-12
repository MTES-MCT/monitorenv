package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.ImageEntity
import kotlinx.serialization.Serializable

@Serializable
class VigilanceAreaImageDataOutput(
    val id: Int?,
    val vigilanceAreaId: Int?,
    val imageName: String,
    val content: ByteArray,
    val mimeType: String,
) {
    companion object {
        fun fromVigilanceAreaImage(
            vigilanceAreaImage: ImageEntity,
        ): VigilanceAreaImageDataOutput {
            return VigilanceAreaImageDataOutput(
                id = vigilanceAreaImage.id,
                vigilanceAreaId = vigilanceAreaImage.vigilanceAreaId,
                imageName = vigilanceAreaImage.imageName,
                content = vigilanceAreaImage.content,
                mimeType = vigilanceAreaImage.mimeType,
            )
        }
    }
}
