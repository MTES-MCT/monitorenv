package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AdditionalRefRegEntity
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.AreaTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea.RegulatoryAreaEntity
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.JdbcType
import org.hibernate.annotations.Type
import org.hibernate.dialect.type.PostgreSQLEnumJdbcType
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import tools.jackson.core.type.TypeReference
import tools.jackson.databind.JsonNode
import tools.jackson.databind.annotation.JsonDeserialize
import tools.jackson.databind.annotation.JsonSerialize
import tools.jackson.databind.json.JsonMapper
import java.time.Instant
import java.time.ZoneOffset

@Entity
@Table(name = "regulatory_areas")
data class RegulatoryAreaModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Int?,
    @Column(name = "area_type", columnDefinition = "regulatory_areas_type")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val areaType: AreaTypeEnum,
    @Column(name = "creation") val creation: Instant?,
    @Column(name = "date") val date: Instant?,
    @Column(name = "date_fin") val dateFin: Instant?,
    @Column(name = "editeur") val editeur: String?,
    @Column(name = "edition_bo") val editionBo: Instant?,
    @Column(name = "edition_cacem") val editionCacem: Instant?,
    @Column(name = "facade") val facade: String?,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    val geom: MultiPolygon?,
    @Column(name = "layer_name") var layerName: String?,
    @Column(name = "location") val location: String?,
    @Column(name = "observation") val observation: String?,
    @Column(name = "plan") val plan: String?,
    @Column(name = "poly_name") val polyName: String?,
    @Column(name = "ref_reg") val refReg: String?,
    @Column(name = "resume") val resume: String?,
    @Column(name = "source") val source: String?,
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
    @Column(name = "type") val type: String?,
    @Column(name = "url") val url: String?,
    @Type(JsonBinaryType::class)
    @Column(name = "additional_ref_reg", columnDefinition = "jsonb")
    val additionalRefReg: JsonNode?,
    @Column(name = "authorization_periods") val authorizationPeriods: String?,
    @Column(name = "prohibition_periods") val prohibitionPeriods: String?,
) {
    fun toRegulatoryArea(mapper: JsonMapper) =
        RegulatoryAreaEntity(
            id = requireNotNull(id),
            areaType = areaType,
            creation = creation?.atZone(ZoneOffset.UTC),
            plan = plan,
            date = date?.atZone(ZoneOffset.UTC),
            dateFin = dateFin?.atZone(ZoneOffset.UTC),
            editeur = editeur,
            editionBo = editionBo?.atZone(ZoneOffset.UTC),
            editionCacem = editionCacem?.atZone(ZoneOffset.UTC),
            facade = facade,
            geom = geom,
            layerName = layerName,
            location = location,
            polyName = polyName,
            observation = observation,
            refReg = refReg,
            resume = resume,
            source = source,
            tags = TagRegulatoryAreaModel.toTagEntities(tags),
            themes = ThemeRegulatoryAreaModel.toThemeEntities(themes),
            type = type,
            url = url,
            additionalRefReg =
                additionalRefReg.let {
                    mapper.convertValue(
                        it,
                        object : TypeReference<
                            List<
                                AdditionalRefRegEntity,
                            >,
                        >() {},
                    )
                },
            authorizationPeriods = authorizationPeriods,
            prohibitionPeriods = prohibitionPeriods,
        )

    companion object {
        fun fromRegulatoryAreaEntity(
            regulatoryArea: RegulatoryAreaEntity,
            mapper: JsonMapper,
        ): RegulatoryAreaModel =
            RegulatoryAreaModel(
                id = regulatoryArea.id,
                areaType = AreaTypeEnum.ZONE,
                creation = regulatoryArea.creation?.toInstant(),
                plan = regulatoryArea.plan,
                date = regulatoryArea.date?.toInstant(),
                dateFin = regulatoryArea.dateFin?.toInstant(),
                editeur = regulatoryArea.editeur,
                editionBo = regulatoryArea.editionBo?.toInstant(),
                editionCacem = regulatoryArea.editionCacem?.toInstant(),
                facade = regulatoryArea.facade,
                geom = regulatoryArea.geom,
                layerName = regulatoryArea.layerName,
                observation = regulatoryArea.observation,
                location = regulatoryArea.location,
                polyName = regulatoryArea.polyName,
                refReg = regulatoryArea.refReg,
                resume = regulatoryArea.resume,
                source = regulatoryArea.source,
                type = regulatoryArea.type,
                url = regulatoryArea.url,
                tags = listOf(),
                themes = listOf(),
                additionalRefReg = regulatoryArea.additionalRefReg.let { mapper.valueToTree<JsonNode>(it) },
                authorizationPeriods = regulatoryArea.authorizationPeriods,
                prohibitionPeriods = regulatoryArea.prohibitionPeriods,
            )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as RegulatoryAreaModel

        return id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
