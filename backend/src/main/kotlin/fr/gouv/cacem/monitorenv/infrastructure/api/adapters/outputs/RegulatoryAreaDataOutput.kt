package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity
import org.locationtech.jts.geom.MultiPolygon

import java.time.ZonedDateTime

data class RegulatoryAreaDataOutput(
    val id: Int,
    val geom: MultiPolygon? = null,
    val entity_name: String? = null,
    val url: String? = null,
    val layer_name: String? = null,
    val facade: String? = null,
    val ref_reg: String? = null,
    val edition: String? = null,
    val editeur: String? = null,
    val source: String? = null,
    val observation: String? = null,
    val thematique: String? = null,
    val echelle: String? = null,
    val date: String? = null,
    val duree_validite: String? = null,
    val date_fin: String? = null,
    val temporalite: String? = null,
    val objet: String? = null,
    val signataire: String? = null) {
    companion object {
        fun fromRegulatoryAreaEntity(regulatoryArea: RegulatoryAreaEntity) = RegulatoryAreaDataOutput(
            id = regulatoryArea.id,
            entity_name= regulatoryArea.entity_name,
            url= regulatoryArea.url,
            layer_name= regulatoryArea.layer_name,
            facade= regulatoryArea.facade,
            ref_reg= regulatoryArea.ref_reg,
            edition= regulatoryArea.edition,
            editeur= regulatoryArea.editeur,
            source= regulatoryArea.source,
            observation= regulatoryArea.observation,
            thematique= regulatoryArea.thematique,
            echelle= regulatoryArea.echelle,
            date= regulatoryArea.date,
            duree_validite= regulatoryArea.duree_validite,
            date_fin= regulatoryArea.date_fin,
            temporalite= regulatoryArea.temporalite,
            objet= regulatoryArea.objet,
            signataire= regulatoryArea.signataire,
            geom = regulatoryArea.geom
//            geom = jacksonObjectMapper().writeValueAsString(regulatoryArea.geom)
        )
    }
}
