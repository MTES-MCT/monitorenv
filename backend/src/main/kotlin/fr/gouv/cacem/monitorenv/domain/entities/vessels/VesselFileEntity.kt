package fr.gouv.cacem.monitorenv.domain.entities.vessels

data class VesselFileEntity(
    val id: Int? = null,
    val content: ByteArray,
    val mimeType: String,
    val name: String,
    val size: Int,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as VesselFileEntity

        if (id != other.id) return false
        if (size != other.size) return false
        if (!content.contentEquals(other.content)) return false
        if (mimeType != other.mimeType) return false
        if (name != other.name) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id ?: 0
        result = 31 * result + size
        result = 31 * result + content.contentHashCode()
        result = 31 * result + mimeType.hashCode()
        result = 31 * result + name.hashCode()
        return result
    }
}
