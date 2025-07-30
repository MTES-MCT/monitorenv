package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.ExtractedAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity

class ExtractedAreaDataOutput(
    val inseeCode: String?,
    val reportingIds: List<Int>,
    val regulatoryAreaIds: List<Int>,
    val ampIds: List<Int>,
    val vigilanceAreaIds: List<Int>,
    val tags: List<TagEntity>,
    val themes: List<ThemeEntity>,
) {
    companion object {
        fun fromExtractAreaEntity(extractedAreaEntity: ExtractedAreaEntity): ExtractedAreaDataOutput =
            ExtractedAreaDataOutput(
                inseeCode = extractedAreaEntity.inseeCode,
                reportingIds = extractedAreaEntity.reportingIds,
                regulatoryAreaIds = extractedAreaEntity.regulatoryAreaIds,
                ampIds = extractedAreaEntity.ampIds,
                vigilanceAreaIds = extractedAreaEntity.vigilanceAreaIds,
                tags = extractedAreaEntity.tags,
                themes = extractedAreaEntity.themes,
            )
    }
}
