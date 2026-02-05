package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput
import java.time.ZonedDateTime

data class RegulatoryAreasDataOutput(
    val id: Int,
    val creation: ZonedDateTime? = null,
    val date: ZonedDateTime? = null,
    val dateFin: ZonedDateTime? = null,
    val editionBo: ZonedDateTime? = null,
    val editionCacem: ZonedDateTime? = null,
    val facade: String? = null,
    val layerName: String? = null,
    val plan: String? = null,
    val polyName: String? = null,
    val refReg: String? = null,
    val resume: String? = null,
    val tags: List<TagOutput>,
    val themes: List<ThemeOutput>,
    val type: String? = null,
    val url: String? = null,
) {
    companion object {
        fun fromRegulatoryAreaEntity(regulatoryArea: RegulatoryAreaNewEntity) =
            RegulatoryAreasDataOutput(
                id = regulatoryArea.id,
                creation = regulatoryArea.creation,
                date = regulatoryArea.date,
                dateFin = regulatoryArea.dateFin,
                editionBo = regulatoryArea.editionBo,
                editionCacem = regulatoryArea.editionCacem,
                facade = regulatoryArea.facade,
                layerName = regulatoryArea.layerName,
                plan = regulatoryArea.plan,
                polyName = regulatoryArea.polyName,
                refReg = regulatoryArea.refReg,
                resume = regulatoryArea.resume,
                tags = regulatoryArea.tags.map { TagOutput.Companion.fromTagEntity(it) },
                themes = regulatoryArea.themes.map { ThemeOutput.Companion.fromThemeEntity(it) },
                type = regulatoryArea.type,
                url = regulatoryArea.url,
            )
    }
}
