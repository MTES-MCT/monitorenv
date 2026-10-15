package fr.gouv.cacem.monitorenv.domain.entities.files

data class ImageEntity(
    val id: Int? = null,
    override val name: String,
    override val content: ByteArray,
    override val mimeType: String,
    override val size: Int,
) : IImageEntity {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ImageEntity

        if (id != other.id) return false
        if (size != other.size) return false
        if (name != other.name) return false
        if (!content.contentEquals(other.content)) return false
        if (mimeType != other.mimeType) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + size
        result = 31 * result + name.hashCode()
        result = 31 * result + content.contentHashCode()
        result = 31 * result + mimeType.hashCode()
        return result
    }
}
