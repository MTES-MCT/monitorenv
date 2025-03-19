package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.SubThemeOutput.Companion.fromSubThemeEntity
import java.time.ZonedDateTime

data class ThemeOutput(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime,
    val endedAt: ZonedDateTime?,
    val subThemes: List<SubThemeOutput>,
) {
    companion object {
        fun fromThemeEntity(themeEntity: ThemeEntity): ThemeOutput =
            ThemeOutput(
                id = themeEntity.id,
                name = themeEntity.name,
                startedAt = themeEntity.startedAt,
                endedAt = themeEntity.endedAt,
                subThemes = themeEntity.subThemes.map { fromSubThemeEntity(it) },
            )
    }
}
