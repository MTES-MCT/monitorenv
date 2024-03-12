package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer

@Entity
@Table(name = "regulations_cacem")
data class RegulatoryAreaModel(
    @Id
    @Column(name = "id")
    val id: Int,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    val geom: MultiPolygon?,
    @Column(name = "entity_name")
    val entity_name: String?,
    @Column(name = "url")
    val url: String?,
    @Column(name = "layer_name")
    val layer_name: String?,
    @Column(name = "facade")
    val facade: String?,
    @Column(name = "ref_reg")
    val ref_reg: String?,
    @Column(name = "edition")
    val edition: String?,
    @Column(name = "editeur")
    val editeur: String?,
    @Column(name = "source")
    val source: String?,
    @Column(name = "observation")
    val observation: String?,
    @Column(name = "thematique")
    val thematique: String?,
    @Column(name = "echelle")
    val echelle: String?,
    @Column(name = "date")
    val date: String?,
    @Column(name = "duree_validite")
    val duree_validite: String?,
    @Column(name = "date_fin")
    val date_fin: String?,
    @Column(name = "temporalite")
    val temporalite: String?,
    @Column(name = "action")
    val action: String?,
    @Column(name = "objet")
    val objet: String?,
    @Column(name = "type")
    val type: String?,
    @Column(name = "signataire")
    val signataire: String?,
) {
    fun toRegulatoryArea() = RegulatoryAreaEntity(
        id = id,
        geom = geom,
        entity_name = entity_name,
        url = url,
        layer_name = layer_name,
        facade = facade,
        ref_reg = ref_reg,
        edition = edition,
        editeur = editeur,
        source = source,
        observation = observation,
        thematique = thematique,
        echelle = echelle,
        date = date,
        duree_validite = duree_validite,
        date_fin = date_fin,
        temporalite = temporalite,
        action = action,
        objet = objet,
        type = type,
        signataire = signataire,
    )

    companion object {
        fun fromRegulatoryAreaEntity(regulatoryArea: RegulatoryAreaEntity) = RegulatoryAreaModel(
            id = regulatoryArea.id,
            geom = regulatoryArea.geom,
            entity_name = regulatoryArea.entity_name,
            url = regulatoryArea.url,
            layer_name = regulatoryArea.layer_name,
            facade = regulatoryArea.facade,
            ref_reg = regulatoryArea.ref_reg,
            edition = regulatoryArea.edition,
            editeur = regulatoryArea.editeur,
            source = regulatoryArea.source,
            observation = regulatoryArea.observation,
            thematique = regulatoryArea.thematique,
            echelle = regulatoryArea.echelle,
            date = regulatoryArea.date,
            duree_validite = regulatoryArea.duree_validite,
            date_fin = regulatoryArea.date_fin,
            temporalite = regulatoryArea.temporalite,
            action = regulatoryArea.action,
            objet = regulatoryArea.objet,
            type = regulatoryArea.type,
            signataire = regulatoryArea.signataire,
        )
    }
}
