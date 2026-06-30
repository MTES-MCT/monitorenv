package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vessel

import fr.gouv.cacem.monitorenv.domain.entities.vessels.VesselFileEntity

data class VesselFileDataInput(
    val id: Int? = null,
    val batchId: Int?,
    val content: ByteArray,
    val mimeType: String,
    val name: String,
    val rowNumber: Int?,
    val size: Int,
    val shipId: Int,
) {
    fun toVesselFile(): VesselFileEntity =
        VesselFileEntity(
            id = id,
            content = content,
            mimeType = mimeType,
            name = name,
            size = size,
        )
}
