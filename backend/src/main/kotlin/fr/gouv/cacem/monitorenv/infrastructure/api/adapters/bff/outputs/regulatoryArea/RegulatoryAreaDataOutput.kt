package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class RegulatoryAreaDataOutput(
    val id: Int,
    val creation: ZonedDateTime? = null,
    val date: ZonedDateTime? = null,
    val dateFin: ZonedDateTime? = null,
    val dureeValidite: String? = null,
    val editeur: String? = null,
    val editionBo: ZonedDateTime? = null,
    val editionCacem: ZonedDateTime? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val layerName: String? = null,
    val observation: String? = null,
    val plan: String? = null,
    val polyName: String? = null,
    val refReg: String? = null,
    val resume: String? = null,
    val source: String? = null,
    val tags: List<TagOutput>,
    val temporalite: String? = null,
    val themes: List<ThemeOutput>,
    val type: String? = null,
    val url: String? = null,
) {
    companion object {
        fun fromRegulatoryAreaEntity(regulatoryArea: RegulatoryAreaNewEntity) =
            RegulatoryAreaDataOutput(
                id = regulatoryArea.id,
                creation = regulatoryArea.creation,
                date = regulatoryArea.date,
                dateFin = regulatoryArea.dateFin,
                dureeValidite = regulatoryArea.dureeValidite,
                editeur = regulatoryArea.editeur,
                editionBo = regulatoryArea.editionBo,
                editionCacem = regulatoryArea.editionCacem,
                facade = regulatoryArea.facade,
                geom = regulatoryArea.geom,
                layerName = regulatoryArea.layerName,
                observation = regulatoryArea.observation,
                plan = regulatoryArea.plan,
                polyName = regulatoryArea.polyName,
                refReg = regulatoryArea.refReg,
                resume = regulatoryArea.resume,
                source = regulatoryArea.source,
                tags = regulatoryArea.tags.map { TagOutput.fromTagEntity(it) },
                temporalite = regulatoryArea.temporalite,
                themes = regulatoryArea.themes.map { ThemeOutput.fromThemeEntity(it) },
                type = regulatoryArea.type,
                url = regulatoryArea.url,
            )
    }
}
