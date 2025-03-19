package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.LinkEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VisibilityEnum
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
import jakarta.persistence.NamedAttributeNode
import jakarta.persistence.NamedEntityGraph
import jakarta.persistence.OneToMany
import jakarta.persistence.OrderBy
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import org.hibernate.annotations.JdbcType
import org.hibernate.annotations.Type
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC
import java.time.ZonedDateTime

@Entity
@NamedEntityGraph(
    name = "VigilanceAreaModel.fullLoad",
    attributeNodes = [
        NamedAttributeNode("images"),
    ],
)
@Table(name = "vigilance_areas")
data class VigilanceAreaModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,
    @Column(name = "comments") val comments: String? = null,
    @Column(name = "computed_end_date") val computedEndDate: Instant? = null,
    @Column(name = "created_by") val createdBy: String? = null,
    @Column(name = "end_date_period") val endDatePeriod: Instant? = null,
    @Column(name = "ending_condition", columnDefinition = "vigilance_area_ending_condition")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val endingCondition: EndingConditionEnum? = null,
    @Column(name = "ending_occurrence_date") val endingOccurrenceDate: Instant? = null,
    @Column(name = "ending_occurrence_number") val endingOccurrencesNumber: Int? = null,
    @Column(name = "frequency", columnDefinition = "vigilance_area_frequency")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val frequency: FrequencyEnum? = null,
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    val geom: MultiPolygon? = null,
    @OneToMany(
        mappedBy = "vigilanceArea",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.EAGER,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("id")
    var images: MutableList<VigilanceAreaImageModel> = mutableListOf(),
    @Column(name = "is_archived", nullable = false) val isArchived: Boolean,
    @Column(name = "is_deleted", nullable = false) val isDeleted: Boolean,
    @Column(name = "is_at_all_times", nullable = false) val isAtAllTimes: Boolean,
    @Column(name = "is_draft") val isDraft: Boolean,
    @Column(name = "links", columnDefinition = "jsonb")
    @Type(JsonBinaryType::class)
    val links: List<LinkEntity>? = listOf(),
    @Column(name = "linked_amps", columnDefinition = "int[]")
    val linkedAMPs: List<Int>? = listOf(),
    @Column(name = "linked_regulatory_areas", columnDefinition = "int[]")
    val linkedRegulatoryAreas: List<Int>? = listOf(),
    @Column(name = "name", nullable = false) val name: String,
    @Column(name = "start_date_period") val startDatePeriod: Instant? = null,
    @Column(name = "sea_front") val seaFront: String? = null,
    @Column(name = "source") val source: String? = null,
    @Column(name = "themes") val themes: List<String>? = null,
    @Column(name = "visibility", columnDefinition = "vigilance_area_visibility")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val visibility: VisibilityEnum? = null,
    @Column(name = "created_at") var createdAt: ZonedDateTime?,
    @Column(name = "updated_at") var updatedAt: ZonedDateTime?,
) {
    companion object {
        fun fromVigilanceArea(vigilanceArea: VigilanceAreaEntity): VigilanceAreaModel =
            VigilanceAreaModel(
                id = vigilanceArea.id,
                comments = vigilanceArea.comments,
                computedEndDate = vigilanceArea.computedEndDate?.toInstant(),
                createdBy = vigilanceArea.createdBy,
                endingCondition = vigilanceArea.endingCondition,
                endingOccurrenceDate = vigilanceArea.endingOccurrenceDate?.toInstant(),
                endingOccurrencesNumber = vigilanceArea.endingOccurrencesNumber,
                frequency = vigilanceArea.frequency,
                endDatePeriod = vigilanceArea.endDatePeriod?.toInstant(),
                geom = vigilanceArea.geom,
                isArchived = vigilanceArea.isArchived,
                isAtAllTimes = vigilanceArea.isAtAllTimes,
                isDeleted = vigilanceArea.isDeleted,
                isDraft = vigilanceArea.isDraft,
                links = vigilanceArea.links,
                linkedAMPs = vigilanceArea.linkedAMPs,
                linkedRegulatoryAreas = vigilanceArea.linkedRegulatoryAreas,
                name = vigilanceArea.name,
                seaFront = vigilanceArea.seaFront,
                source = vigilanceArea.source,
                startDatePeriod = vigilanceArea.startDatePeriod?.toInstant(),
                themes = vigilanceArea.themes,
                visibility = vigilanceArea.visibility,
                createdAt = vigilanceArea.createdAt,
                updatedAt = vigilanceArea.updatedAt,
            )
    }

    fun toVigilanceAreaEntity(): VigilanceAreaEntity =
        VigilanceAreaEntity(
            id = id,
            comments = comments,
            computedEndDate = computedEndDate?.atZone(UTC),
            createdBy = createdBy,
            endingCondition = endingCondition,
            endingOccurrenceDate = endingOccurrenceDate?.atZone(UTC),
            endingOccurrencesNumber = endingOccurrencesNumber,
            frequency = frequency,
            endDatePeriod = endDatePeriod?.atZone(UTC),
            geom = geom,
            isAtAllTimes = isAtAllTimes,
            isArchived = isArchived,
            isDeleted = isDeleted,
            isDraft = isDraft,
            images = images.map { it.toVigilanceAreaImage() },
            links = links,
            linkedAMPs = linkedAMPs,
            linkedRegulatoryAreas = linkedRegulatoryAreas,
            name = name,
            seaFront = seaFront,
            source = source,
            startDatePeriod = startDatePeriod?.atZone(UTC),
            themes = themes,
            visibility = visibility,
            createdAt = createdAt,
            updatedAt = updatedAt,
        )

    @PrePersist
    private fun prePersist() {
        this.createdAt = ZonedDateTime.now()
    }

    @PreUpdate
    private fun preUpdate() {
        this.updatedAt = ZonedDateTime.now()
    }
}
