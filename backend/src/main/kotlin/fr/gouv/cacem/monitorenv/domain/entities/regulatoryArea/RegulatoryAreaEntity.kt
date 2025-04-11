package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import org.locationtech.jts.geom.MultiPolygon

data class RegulatoryAreaEntity(
    val id: Int,
    val geom: MultiPolygon? = null,
    val entityName: String? = null,
    val url: String? = null,
    val layerName: String? = null,
    val facade: String? = null,
    val refReg: String? = null,
    val edition: String? = null,
    val editeur: String? = null,
    val source: String? = null,
    val observation: String? = null,
    val tags: List<TagEntity>,
    val date: String? = null,
    val dureeValidite: String? = null,
    val dateFin: String? = null,
    val temporalite: String? = null,
    val type: String? = null,
)
