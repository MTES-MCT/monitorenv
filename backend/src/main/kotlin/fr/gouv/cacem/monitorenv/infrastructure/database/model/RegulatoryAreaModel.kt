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
    @Column(name = "date_fin") val dateFin: String?,
    @Column(name = "duree_validite") val dureeValidite: String?,
    @Column(name = "editeur") val editeur: String?,
    @Column(name = "edition") val edition: String?,
    @Column(name = "entity_name") val entityName: String?,
    @Column(name = "facade") val facade: String?,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    val geom: MultiPolygon?,
    @Column(name = "layer_name") val layerName: String?,
    @Column(name = "observation") val observation: String?,
    @Column(name = "ref_reg") val refReg: String?,
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
            dateFin = dateFin,
            dureeValidite = dureeValidite,
            editeur = editeur,
            edition = edition,
            entityName = entityName,
            facade = facade,
            geom = geom,
            layerName = layerName,
            observation = observation,
            refReg = refReg,
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
                dateFin = regulatoryArea.dateFin,
                dureeValidite = regulatoryArea.dureeValidite,
                editeur = regulatoryArea.editeur,
                edition = regulatoryArea.edition,
                entityName = regulatoryArea.entityName,
                facade = regulatoryArea.facade,
                geom = regulatoryArea.geom,
                layerName = regulatoryArea.layerName,
                observation = regulatoryArea.observation,
                refReg = regulatoryArea.refReg,
                source = regulatoryArea.source,
                temporalite = regulatoryArea.temporalite,
                thematique = regulatoryArea.thematique,
                type = regulatoryArea.type,
                url = regulatoryArea.url,
            )
    }
}
