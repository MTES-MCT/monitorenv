package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity

data class PropagatedValuesEntity(
    val authorizationPeriods: String?,
    val prohibitionPeriods: String?,
    val resume: String?,
    val tags: List<TagEntity>,
    val themes: List<ThemeEntity>,
) {
    companion object {
        fun fromRegulatoryAreaGroup(group: RegulatoryAreaGroupEntity) =
            PropagatedValuesEntity(
                authorizationPeriods = group.authorizationPeriods,
                prohibitionPeriods = group.prohibitionPeriods,
                resume = group.resume,
                tags = group.tags,
                themes = group.themes,
            )

        fun fromRegulatoryArea(regulatoryArea: RegulatoryAreaEntity) =
            PropagatedValuesEntity(
                authorizationPeriods = regulatoryArea.authorizationPeriods,
                prohibitionPeriods = regulatoryArea.prohibitionPeriods,
                resume = regulatoryArea.resume,
                tags = regulatoryArea.tags,
                themes = regulatoryArea.themes,
            )
    }
}
