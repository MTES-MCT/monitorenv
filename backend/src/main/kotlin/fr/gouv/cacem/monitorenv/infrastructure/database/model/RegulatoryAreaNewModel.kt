package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.OtherRefRegEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaNewEntity
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagRegulatoryAreaNewModel.Companion.toTagEntities
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeRegulatoryAreaNewModel.Companion.toThemeEntities
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.FetchType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.Type
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC

@Entity
@Table(name = "regulatory_areas")
data class RegulatoryAreaNewModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    val id: Int,
    @Column(name = "creation") val creation: Instant?,
    @Column(name = "date") val date: Instant?,
    @Column(name = "date_fin") val dateFin: Instant?,
    @Column(name = "duree_validite") val dureeValidite: String?,
    @Column(name = "editeur") val editeur: String?,
    @Column(name = "edition_bo") val editionBo: Instant?,
    @Column(name = "edition_cacem") val editionCacem: Instant?,
    @Column(name = "facade") val facade: String?,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    val geom: MultiPolygon?,
    @Column(name = "layer_name") val layerName: String?,
    @Column(name = "observation") val observation: String?,
    @Column(name = "plan") val plan: String?,
    @Column(name = "poly_name") val polyName: String?,
    @Column(name = "ref_reg") val refReg: String?,
    @Column(name = "resume") val resume: String?,
    @Column(name = "source") val source: String?,
    @Column(name = "temporalite") val temporalite: String?,
    @OneToMany(
        mappedBy = "regulatoryArea",
        fetch = FetchType.LAZY,
    )
    var tags: List<TagRegulatoryAreaNewModel>,
    @OneToMany(
        mappedBy = "regulatoryArea",
        fetch = FetchType.LAZY,
    )
    var themes: List<ThemeRegulatoryAreaNewModel>,
    @Column(name = "type") val type: String?,
    @Column(name = "url") val url: String?,
    @Type(JsonBinaryType::class)
    @Column(name = "others_ref_reg", columnDefinition = "jsonb")
    val othersRefReg: JsonNode?,
    @Column(name = "authorization_periods") val authorizationPeriods: String?,
    @Column(name = "prohibition_periods") val prohibitionPeriods: String?,
) {
    fun toRegulatoryArea(mapper: ObjectMapper) =
        RegulatoryAreaNewEntity(
            id = id,
            creation = creation?.atZone(UTC),
            plan = plan,
            date = date?.atZone(UTC),
            dateFin = dateFin?.atZone(UTC),
            dureeValidite = dureeValidite,
            editeur = editeur,
            editionBo = editionBo?.atZone(UTC),
            editionCacem = editionCacem?.atZone(UTC),
            facade = facade,
            geom = geom,
            layerName = layerName,
            polyName = polyName,
            observation = observation,
            refReg = refReg,
            resume = resume,
            source = source,
            temporalite = temporalite,
            tags =
                if (Hibernate.isInitialized(tags)) {
                    toTagEntities(tags)
                } else {
                    emptyList()
                },
            themes =
                if (Hibernate.isInitialized(themes)) {
                    toThemeEntities(themes)
                } else {
                    emptyList()
                },
            type = type,
            url = url,
            othersRefReg =
                othersRefReg.let {
                    mapper.convertValue(
                        it,
                        object : TypeReference<
                            List<
                                OtherRefRegEntity,
                            >,
                        >() {},
                    )
                },
            authorizationPeriods = authorizationPeriods,
            prohibitionPeriods = prohibitionPeriods,
        )

    companion object {
        fun fromRegulatoryAreaEntity(
            regulatoryArea: RegulatoryAreaNewEntity,
            mapper: ObjectMapper,
        ): RegulatoryAreaNewModel =
            RegulatoryAreaNewModel(
                id = regulatoryArea.id,
                creation = regulatoryArea.creation?.toInstant(),
                plan = regulatoryArea.plan,
                date = regulatoryArea.date?.toInstant(),
                dateFin = regulatoryArea.dateFin?.toInstant(),
                dureeValidite = regulatoryArea.dureeValidite,
                editeur = regulatoryArea.editeur,
                editionBo = regulatoryArea.editionBo?.toInstant(),
                editionCacem = regulatoryArea.editionCacem?.toInstant(),
                facade = regulatoryArea.facade,
                geom = regulatoryArea.geom,
                layerName = regulatoryArea.layerName,
                observation = regulatoryArea.observation,
                polyName = regulatoryArea.polyName,
                refReg = regulatoryArea.refReg,
                resume = regulatoryArea.resume,
                source = regulatoryArea.source,
                temporalite = regulatoryArea.temporalite,
                type = regulatoryArea.type,
                url = regulatoryArea.url,
                tags = listOf(),
                themes = listOf(),
                othersRefReg = regulatoryArea.othersRefReg.let { mapper.valueToTree<JsonNode>(it) },
                authorizationPeriods = regulatoryArea.authorizationPeriods,
                prohibitionPeriods = regulatoryArea.prohibitionPeriods,
            )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as RegulatoryAreaNewModel

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
