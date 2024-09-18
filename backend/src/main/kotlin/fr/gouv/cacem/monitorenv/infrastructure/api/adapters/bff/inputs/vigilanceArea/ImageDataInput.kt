package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea

import kotlinx.serialization.Serializable

@Serializable
data class ImageDataInput(
    val id: Int? = null,
    val vigilanceAreaId: Int? = null,
    val name: String,
    val content: String,
    val mimeType: String,
    val size: Int,
)
