package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class RegulatoryAreaDataInput(
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
    val tags: List<TagEntity>,
    val temporalite: String? = null,
    val themes: List<ThemeEntity>,
    val type: String? = null,
    val url: String? = null,
) {
    fun toRegulatoryAreaEntity(): RegulatoryAreaNewEntity =
        RegulatoryAreaNewEntity(
            id = id,
            creation = creation,
            date = date,
            dateFin = dateFin,
            dureeValidite = dureeValidite,
            editeur = editeur,
            editionBo = editionBo,
            editionCacem = editionCacem,
            facade = facade,
            geom = geom,
            layerName = layerName,
            observation = observation,
            plan = plan,
            polyName = polyName,
            refReg = refReg,
            resume = resume,
            source = source,
            tags = tags,
            temporalite = temporalite,
            themes = themes,
            type = type,
            url = url,
        )
}
