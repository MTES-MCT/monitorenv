package fr.gouv.cacem.monitorenv.domain.entities.themes

import java.time.ZonedDateTime

class SubThemeEntity(
    val id: Int,
    val name: String,
    val startedAt: ZonedDateTime,
    val endedAt: ZonedDateTime?,
)
