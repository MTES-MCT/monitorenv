package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.files.ImageEntity
import kotlinx.serialization.Serializable
import kotlin.io.encoding.Base64

@Serializable
class ReportingImageDataOutput(
    val id: Int?,
    val name: String,
    val content: String,
    val mimeType: String,
    val size: Int,
) {
    companion object {
        fun fromImageEntity(file: ImageEntity): ReportingImageDataOutput =
            ReportingImageDataOutput(
                id = file.id,
                name = file.name,
                content = Base64.encode(file.content),
                mimeType = file.mimeType,
                size = file.size,
            )
    }
}
