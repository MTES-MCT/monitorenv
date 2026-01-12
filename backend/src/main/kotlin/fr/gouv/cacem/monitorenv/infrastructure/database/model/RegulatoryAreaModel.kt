package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaModel.Companion.toTagEntities
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaModel.Companion.toThemeEntities
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer

@Entity
@Table(name = "regulations_cacem")
data class RegulatoryAreaModel(
    @Id @Column(name = "id") val id: Int,
    @Column(name = "plan") val plan: String?,
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
    @Column(name = "poly_name") val polyName: String?,
    @Column(name = "ref_reg") val refReg: String?,
    @Column(name = "source") val source: String?,
    @Column(name = "temporalite") val temporalite: String?,
    @OneToMany(
        mappedBy = "regulatoryArea",
        fetch = FetchType.LAZY,
    )
    var tags: List<TagRegulatoryAreaModel>,
    @OneToMany(
        mappedBy = "regulatoryArea",
        fetch = FetchType.LAZY,
    )
    var themes: List<ThemeRegulatoryAreaModel>,
    @Column(name = "resume") val resume: String?,
    @Column(name = "type") val type: String?,
    @Column(name = "url") val url: String?,
) {
    fun toRegulatoryArea() =
        RegulatoryAreaEntity(
            id = id,
            plan = plan,
            date = date,
            dateFin = dateFin,
            dureeValidite = dureeValidite,
            editeur = editeur,
            edition = edition,
            entityName = entityName,
            facade = facade,
            geom = geom,
            layerName = layerName,
            polyName = polyName,
            observation = observation,
            refReg = refReg,
            resume = resume,
            source = source,
            temporalite = temporalite,
            tags = toTagEntities(tags),
            themes = toThemeEntities(themes),
            type = type,
            url = url,
        )

    override fun toString(): String =
        "RegulatoryAreaModel(id=$id, plan=$plan, date=$date, dateFin=$dateFin, dureeValidite=$dureeValidite, editeur=$editeur, edition=$edition, entityName=$entityName, facade=$facade, geom=$geom, layerName=$layerName, observation=$observation, polyName=$polyName, refReg=$refReg, resume=$resume, source=$source, temporalite=$temporalite, type=$type, url=$url)"
}
