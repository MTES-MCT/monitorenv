package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import java.time.ZonedDateTime

data class RegulatoryAreaGroupEntity(
    val id: Int?,
    val additionalRefReg: List<AdditionalRefRegEntity>? = listOf(),
    val authorizationPeriods: String? = null,
    val date: ZonedDateTime?,
    val dateFin: ZonedDateTime?,
    val layerName: String?,
    val location: String?,
    val prohibitionPeriods: String? = null,
    val propagation: Map<PropagatedFieldEnum, PropagationOptionEntity> = mapOf(),
    val regulatoryAreaIds: List<Int>,
    val refReg: String?,
    val resume: String? = null,
    val tags: List<TagEntity> = listOf(),
    val themes: List<ThemeEntity> = listOf(),
    val type: String?,
    val url: String?,
) {
    val propagatedFields: Set<PropagatedFieldEnum>
        get() = propagation.filterValues { it.enabled }.keys
}
