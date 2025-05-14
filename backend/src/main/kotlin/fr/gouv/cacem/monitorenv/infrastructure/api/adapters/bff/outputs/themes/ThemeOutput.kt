package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes

import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import java.time.ZonedDateTime

data class ThemeOutput(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime?,
    val endedAt: ZonedDateTime?,
    val subThemes: List<ThemeOutput>,
) {
    companion object {
        fun fromThemeEntity(themeEntity: ThemeEntity): ThemeOutput =
            ThemeOutput(
                id = themeEntity.id,
                name = themeEntity.name,
                startedAt = themeEntity.startedAt,
                endedAt = themeEntity.endedAt,
                subThemes = themeEntity.subThemes.map { fromThemeEntity(it) },
            )
    }
}
