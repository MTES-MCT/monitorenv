package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryAreas.RegulatoryAreaEntity
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
    var id: Int,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    var geom: MultiPolygon?,
    @Column(name = "entity_name")
    var entity_name: String?,
    @Column(name = "url")
    var url: String?,
    @Column(name = "layer_name")
    var layer_name: String?,
    @Column(name = "facade")
    var facade: String?,
    @Column(name = "ref_reg")
    var ref_reg: String?,
    @Column(name = "edition")
    var edition: String?,
    @Column(name = "editeur")
    var editeur: String?,
    @Column(name = "source")
    var source: String?,
    @Column(name = "observation")
    var observation: String?,
    @Column(name = "thematique")
    var thematique: String?,
    @Column(name = "echelle")
    var echelle: String?,
    @Column(name = "date")
    var date: String?,
    @Column(name = "duree_validite")
    var duree_validite: String?,
    @Column(name = "date_fin")
    var date_fin: String?,
    @Column(name = "temporalite")
    var temporalite: String?,
    @Column(name = "objet")
    var objet: String?,
    @Column(name = "signataire")
    var signataire: String?,
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
        objet = objet,
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
            objet = regulatoryArea.objet,
            signataire = regulatoryArea.signataire,
        )
    }
}
