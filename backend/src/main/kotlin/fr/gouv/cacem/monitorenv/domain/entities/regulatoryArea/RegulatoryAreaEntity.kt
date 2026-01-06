package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import org.locationtech.jts.geom.MultiPolygon

data class RegulatoryAreaEntity(
    val id: Int,
    val plan: String? = null,
    val date: String? = null,
    val dateFin: String? = null,
    val dureeValidite: String? = null,
    val editeur: String? = null,
    val edition: String? = null,
    val entityName: String? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val layerName: String? = null,
    val observation: String? = null,
    val refReg: String? = null,
    val source: String? = null,
    val tags: List<TagEntity>,
    val temporalite: String? = null,
    val themes: List<ThemeEntity>,
    val type: String? = null,
    val url: String? = null,
)
