package fr.gouv.cacem.monitorenv.domain.entities.themes

import java.time.ZonedDateTime

data class ThemeEntity(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime?,
    val endedAt: ZonedDateTime?,
    val subThemes: List<ThemeEntity>,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other !is ThemeEntity) return false

        if (id != other.id) return false
        if (name != other.name) return false
        if (startedAt != other.startedAt) return false
        if (endedAt != other.endedAt) return false
        if (subThemes != other.subThemes) return false

        return true
    }

    override fun hashCode(): Int {
        var result = id
        result = 31 * result + name.hashCode()
        result = 31 * result + (startedAt?.hashCode() ?: 0)
        result = 31 * result + (endedAt?.hashCode() ?: 0)
        result = 31 * result + subThemes.hashCode()
        return result
    }
}
