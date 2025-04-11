package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import java.time.ZonedDateTime

data class ThemeInput(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime?,
    val endedAt: ZonedDateTime?,
    val subThemes: List<ThemeInput> = listOf(),
) {
    fun toThemeEntity(): ThemeEntity =
        ThemeEntity(
            id = id,
            name = name,
            startedAt = startedAt,
            endedAt = endedAt,
            subThemes = subThemes.map { it.toThemeEntity() },
        )
}
