package fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea

data class ImageEntity(
    val id: Int? = null,
    val name: String,
    val content: ByteArray,
    val mimeType: String,
    val size: Int,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as ImageEntity

        if (id != other.id) return false
        if (name != other.name) return false
        if (mimeType != other.mimeType) return false
        if (size != other.size) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id?.hashCode() ?: 0
        result = 31 * result + name.hashCode()
        result = 31 * result + mimeType.hashCode()
        result = 31 * result + size
        return result
    }
}
