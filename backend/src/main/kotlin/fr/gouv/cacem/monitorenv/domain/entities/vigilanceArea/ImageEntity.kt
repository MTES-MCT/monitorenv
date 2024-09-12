package fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea

import kotlinx.serialization.Serializable

@Serializable
data class ImageEntity(
    val id: Int? = null,
    val vigilanceAreaId: Int? = null,
    val imageName: String,
    val content: ByteArray,
    val mimeType: String,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ImageEntity

        if (id != other.id) return false
        if (imageName != other.imageName) return false
        if (mimeType != other.mimeType) return false
        if (vigilanceAreaId != other.vigilanceAreaId) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + imageName.hashCode()
        result = 31 * result + mimeType.hashCode()
        result = 31 * result + vigilanceAreaId.hashCode()
        return result
    }
}
