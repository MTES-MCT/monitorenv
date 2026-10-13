package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.files.IImageEntity
import java.util.UUID

data class ImageEntity(
    val id: UUID?,
    override val name: String,
    override val content: ByteArray,
    override val mimeType: String,
    override val size: Int,
) : IImageEntity {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ImageEntity

        if (size != other.size) return false
        if (id != other.id) return false
        if (name != other.name) return false
        if (!content.contentEquals(other.content)) return false
        if (mimeType != other.mimeType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = size
        result = 31 * result + (id?.hashCode() ?: 0)
        result = 31 * result + name.hashCode()
        result = 31 * result + content.contentHashCode()
        result = 31 * result + mimeType.hashCode()
        return result
    }
}
