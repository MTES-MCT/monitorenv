package fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea

import kotlinx.serialization.Serializable

@Serializable
data class ImageInputEntity(
    val id: Int? = null,
    val vigilanceAreaId: Int? = null,
    val name: String,
    val content: String,
    val mimeType: String,
    val size: Int,
)
