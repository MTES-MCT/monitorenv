package fr.gouv.cacem.monitorenv.domain.entities.tags

import java.time.ZonedDateTime

data class TagEntity(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime?,
    val endedAt: ZonedDateTime?,
    val subTags: List<TagEntity>,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is TagEntity) return false

        if (id != other.id) return false
        if (name != other.name) return false
        if (startedAt != other.startedAt) return false
        if (endedAt != other.endedAt) return false
        if (subTags != other.subTags) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id
        result = 31 * result + name.hashCode()
        result = 31 * result + (startedAt?.hashCode() ?: 0)
        result = 31 * result + (endedAt?.hashCode() ?: 0)
        result = 31 * result + subTags.hashCode()
        return result
    }
}
