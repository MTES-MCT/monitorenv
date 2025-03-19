package fr.gouv.cacem.monitorenv.domain.entities.themes

import java.time.ZonedDateTime

class ThemeEntity(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime,
    val endedAt: ZonedDateTime?,
    val subThemes: List<SubThemeEntity>,
)
