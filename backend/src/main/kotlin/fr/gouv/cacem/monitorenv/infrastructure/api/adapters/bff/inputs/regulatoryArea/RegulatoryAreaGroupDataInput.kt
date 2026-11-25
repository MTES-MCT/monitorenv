package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AdditionalRefRegEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagatedFieldEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.PropagationOptionEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaGroupEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.TagInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.themes.ThemeInput
import java.time.ZonedDateTime

data class RegulatoryAreaGroupDataInput(
    val id: Int?,
    val additionalRefReg: List<AdditionalRefRegEntity>?,
    val authorizationPeriods: String? = null,
    val date: ZonedDateTime?,
    val dateFin: ZonedDateTime?,
    val layerName: String?,
    val location: String?,
    val prohibitionPeriods: String? = null,
    val propagation: Map<PropagatedFieldEnum, PropagationOptionDataInput> = mapOf(),
    val regulatoryAreaIds: List<Int>,
    val refReg: String?,
    val resume: String? = null,
    val tags: List<TagInput> = listOf(),
    val themes: List<ThemeInput> = listOf(),
    val type: String?,
    val url: String?,
) {
    fun toRegulatoryAreaGroup(): RegulatoryAreaGroupEntity =
        RegulatoryAreaGroupEntity(
            id = id,
            additionalRefReg = additionalRefReg,
            authorizationPeriods = authorizationPeriods,
            date = date,
            dateFin = dateFin,
            layerName = layerName,
            location = location,
            prohibitionPeriods = prohibitionPeriods,
            propagation = propagation.mapValues { (_, option) -> option.toPropagationOptionEntity() },
            regulatoryAreaIds = regulatoryAreaIds,
            refReg = refReg,
            resume = resume,
            tags = tags.map { it.toTagEntity() },
            themes = themes.map { it.toThemeEntity() },
            type = type,
            url = url,
        )
}

data class PropagationOptionDataInput(
    val enabled: Boolean,
    val overwriteExisting: Boolean? = null,
) {
    fun toPropagationOptionEntity() = PropagationOptionEntity(enabled = enabled, overwriteExisting = overwriteExisting)
}
