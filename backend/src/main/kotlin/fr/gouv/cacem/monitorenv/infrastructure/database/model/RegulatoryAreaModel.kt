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
        @Id @Column(name = "id") val id: Int,
        @Column(name = "date") val date: String?,
        @Column(name = "date_fin") val date_fin: String?,
        @Column(name = "duree_validite") val duree_validite: String?,
        @Column(name = "editeur") val editeur: String?,
        @Column(name = "edition") val edition: String?,
        @Column(name = "entity_name") val entity_name: String?,
        @Column(name = "facade") val facade: String?,
        @JsonSerialize(using = GeometrySerializer::class)
        @JsonDeserialize(contentUsing = GeometryDeserializer::class)
        @Column(name = "geom")
        val geom: MultiPolygon?,
        @JsonSerialize(using = GeometrySerializer::class)
        @JsonDeserialize(contentUsing = GeometryDeserializer::class)
        @Column(name = "geometry_simplified")
        val geometry_simplified: MultiPolygon?,
        @Column(name = "layer_name") val layer_name: String?,
        @Column(name = "observation") val observation: String?,
        @Column(name = "ref_reg") val ref_reg: String?,
        @Column(name = "source") val source: String?,
        @Column(name = "temporalite") val temporalite: String?,
        @Column(name = "thematique") val thematique: String?,
        @Column(name = "type") val type: String?,
        @Column(name = "url") val url: String?,
) {
    fun toRegulatoryArea() =
            RegulatoryAreaEntity(
                    id = id,
                    date = date,
                    date_fin = date_fin,
                    duree_validite = duree_validite,
                    editeur = editeur,
                    edition = edition,
                    entity_name = entity_name,
                    facade = facade,
                    geom = geom,
                    geometry_simplified = geometry_simplified,
                    layer_name = layer_name,
                    observation = observation,
                    ref_reg = ref_reg,
                    source = source,
                    temporalite = temporalite,
                    thematique = thematique,
                    type = type,
                    url = url,
            )

    companion object {
        fun fromRegulatoryAreaEntity(regulatoryArea: RegulatoryAreaEntity) =
                RegulatoryAreaModel(
                        id = regulatoryArea.id,
                        date = regulatoryArea.date,
                        date_fin = regulatoryArea.date_fin,
                        duree_validite = regulatoryArea.duree_validite,
                        editeur = regulatoryArea.editeur,
                        edition = regulatoryArea.edition,
                        entity_name = regulatoryArea.entity_name,
                        facade = regulatoryArea.facade,
                        geom = regulatoryArea.geom,
                        geometry_simplified = regulatoryArea.geometry_simplified,
                        layer_name = regulatoryArea.layer_name,
                        observation = regulatoryArea.observation,
                        ref_reg = regulatoryArea.ref_reg,
                        source = regulatoryArea.source,
                        temporalite = regulatoryArea.temporalite,
                        thematique = regulatoryArea.thematique,
                        type = regulatoryArea.type,
                        url = regulatoryArea.url,
                )
    }
}
