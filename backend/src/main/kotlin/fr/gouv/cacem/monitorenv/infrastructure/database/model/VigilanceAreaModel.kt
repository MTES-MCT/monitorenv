package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.LinkEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VisibilityEnum
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagVigilanceAreaModel.Companion.toTagEntities
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeVigilanceAreaModel.Companion.toThemeEntities
import fr.gouv.cacem.monitorenv.infrastructure.database.model.VigilanceAreaSourceModel.Companion.toVigilanceAreaSources
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType
import jakarta.persistence.CascadeType
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.OneToMany
import jakarta.persistence.OrderBy
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.JdbcType
import org.hibernate.annotations.Type
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.ZonedDateTime

@Entity
@Table(name = "vigilance_areas")
data class VigilanceAreaModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "vigilanceArea")
    val sources: List<VigilanceAreaSourceModel>,
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "vigilanceArea")
    val periods: List<VigilanceAreaPeriodModel>,
    @Column(name = "comments") val comments: String? = null,
    @Column(name = "created_by") val createdBy: String? = null,
    @param:JsonSerialize(using = GeometrySerializer::class)
    @param:JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    val geom: MultiPolygon? = null,
    @OneToMany(
        mappedBy = "vigilanceArea",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.LAZY,
    )
    @OrderBy("id")
    var images: MutableList<VigilanceAreaImageModel> = mutableListOf(),
    @Column(name = "is_deleted", nullable = false) val isDeleted: Boolean,
    @Column(name = "is_draft") val isDraft: Boolean,
    @Column(name = "links", columnDefinition = "jsonb")
    @Type(JsonBinaryType::class)
    val links: JsonNode? = null,
    @Column(name = "linked_amps", columnDefinition = "int[]")
    val linkedAMPs: List<Int>? = listOf(),
    @Column(name = "linked_regulatory_areas", columnDefinition = "int[]")
    val linkedRegulatoryAreas: List<Int>? = listOf(),
    @Column(name = "name", nullable = false) val name: String,
    @Column(name = "sea_front") val seaFront: String? = null,
    @Column(name = "visibility", columnDefinition = "vigilance_area_visibility")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val visibility: VisibilityEnum? = null,
    @Column(name = "created_at") var createdAt: ZonedDateTime?,
    @Column(name = "updated_at") var updatedAt: ZonedDateTime?,
    @OneToMany(
        mappedBy = "vigilanceArea",
        fetch = FetchType.LAZY,
    )
    @OrderBy("id")
    val tags: List<TagVigilanceAreaModel>,
    @OneToMany(
        mappedBy = "vigilanceArea",
        fetch = FetchType.LAZY,
    )
    @OrderBy("id")
    val themes: List<ThemeVigilanceAreaModel>,
    @Column(name = "validated_at") var validatedAt: ZonedDateTime?,
) {
    companion object {
        fun fromVigilanceArea(
            vigilanceArea: VigilanceAreaEntity,
            mapper: ObjectMapper,
        ): VigilanceAreaModel {
            val vigilanceAreaModel =
                VigilanceAreaModel(
                    id = vigilanceArea.id,
                    comments = vigilanceArea.comments,
                    createdBy = vigilanceArea.createdBy,
                    geom = vigilanceArea.geom,
                    isDeleted = vigilanceArea.isDeleted,
                    isDraft = vigilanceArea.isDraft,
                    links = vigilanceArea.links?.let { mapper.valueToTree<JsonNode>(it) },
                    linkedAMPs = vigilanceArea.linkedAMPs,
                    linkedRegulatoryAreas = vigilanceArea.linkedRegulatoryAreas,
                    name = vigilanceArea.name,
                    seaFront = vigilanceArea.seaFront,
                    themes = listOf(),
                    visibility = vigilanceArea.visibility,
                    createdAt = vigilanceArea.createdAt,
                    updatedAt = vigilanceArea.updatedAt,
                    tags = listOf(),
                    sources = listOf(),
                    periods = listOf(),
                    validatedAt = vigilanceArea.validatedAt,
                )

            return vigilanceAreaModel
        }
    }

    fun toVigilanceAreaEntity(mapper: ObjectMapper): VigilanceAreaEntity =
        VigilanceAreaEntity(
            id = id,
            comments = comments,
            createdBy = createdBy,
            geom = geom,
            isDeleted = isDeleted,
            isDraft = isDraft,
            images = images.map { it.toVigilanceAreaImage() },
            links =
                links?.let {
                    mapper.convertValue(
                        it,
                        object : TypeReference<List<LinkEntity>>() {},
                    )
                },
            linkedAMPs = linkedAMPs,
            linkedRegulatoryAreas = linkedRegulatoryAreas,
            name = name,
            seaFront = seaFront,
            sources = toVigilanceAreaSources(sources),
            themes = toThemeEntities(themes),
            visibility = visibility,
            createdAt = createdAt,
            updatedAt = updatedAt,
            tags = toTagEntities(tags),
            validatedAt = validatedAt,
            periods = periods.map { it.toVigilanceAreaPeriodEntity() },
        )

    @PrePersist
    private fun prePersist() {
        this.createdAt = ZonedDateTime.now()
    }

    @PreUpdate
    private fun preUpdate() {
        this.updatedAt = ZonedDateTime.now()
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as VigilanceAreaModel

        return id != null && id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()
}
