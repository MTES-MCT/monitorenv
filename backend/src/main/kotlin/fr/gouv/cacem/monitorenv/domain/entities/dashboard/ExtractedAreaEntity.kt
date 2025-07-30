package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity

data class ExtractedAreaEntity(
    val inseeCode: String?,
    val reportingIds: List<Int>,
    val regulatoryAreaIds: List<Int>,
    val ampIds: List<Int>,
    val vigilanceAreaIds: List<Int>,
    val tags: List<TagEntity>,
    val themes: List<ThemeEntity>,
)
