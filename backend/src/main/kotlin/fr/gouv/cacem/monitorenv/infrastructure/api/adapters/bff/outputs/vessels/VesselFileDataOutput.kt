package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vessels

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselFileEntity
import kotlin.io.encoding.Base64

data class VesselFileDataOutput(
    val id: Int?,
    val content: String,
    val mimeType: String,
    val name: String,
    val size: Int,
) {
    companion object {
        fun fromVesselFile(vesselFile: VesselFileEntity): VesselFileDataOutput =
            VesselFileDataOutput(
                id = vesselFile.id,
                name = vesselFile.name,
                content = Base64.encode(vesselFile.content),
                mimeType = vesselFile.mimeType,
                size = vesselFile.size,
            )
    }
}
