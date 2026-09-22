package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.themes

import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import java.time.ZonedDateTime

data class CreateOrUpdateThemeInput(
    val id: Int?,
    val endedAt: ZonedDateTime?,
    val name: String,
    val startedAt: ZonedDateTime?,
    val subThemes: List<CreateOrUpdateThemeInput>? = null,
) {
    fun toThemeEntity(): ThemeEntity =
        ThemeEntity(
            id = id,
            name = name,
            startedAt = startedAt,
            endedAt = endedAt,
            subThemes = subThemes?.map { it.toThemeEntity() } ?: emptyList(),
        )
}
