package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.*
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType
import jakarta.persistence.*
import org.hibernate.annotations.JdbcType
import org.hibernate.annotations.Type
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import org.locationtech.jts.geom.MultiPolygon
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC

@Entity
@Table(name = "vigilance_areas")
data class VigilanceAreaModel(
    @Id
    @Column(name = "id", nullable = false, unique = true)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Int? = null,
    @Column(name = "comments") val comments: String? = null,
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
    @Column(name = "is_deleted", nullable = false) val isDeleted: Boolean,
    @Column(name = "is_draft") val isDraft: Boolean,
    @Column(name = "links", columnDefinition = "jsonb")
    @Type(JsonBinaryType::class)
    val links: List<LinkEntity>? = listOf(),
    @Column(name = "linked_regulatory_areas", columnDefinition = "int[]")
    val linkedRegulatoryAreas: List<Int>? = listOf(),
    @Column(name = "name") val name: String? = null,
    @Column(name = "start_date_period") val startDatePeriod: Instant? = null,
    @Column(name = "source") val source: String? = null,
    @Column(name = "themes") val themes: List<String>? = null,
    @Column(name = "visibility", columnDefinition = "vigilance_area_visibility")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    val visibility: VisibilityEnum? = null,
) {
    companion object {
        fun fromVigilanceArea(vigilanceArea: VigilanceAreaEntity): VigilanceAreaModel {
            return VigilanceAreaModel(
                id = vigilanceArea.id,
                comments = vigilanceArea.comments,
                createdBy = vigilanceArea.createdBy,
                endingCondition = vigilanceArea.endingCondition,
                endingOccurrenceDate = vigilanceArea.endingOccurrenceDate?.toInstant(),
                endingOccurrencesNumber = vigilanceArea.endingOccurrencesNumber,
                frequency = vigilanceArea.frequency,
                endDatePeriod = vigilanceArea.endDatePeriod?.toInstant(),
                geom = vigilanceArea.geom,
                isDeleted = vigilanceArea.isDeleted,
                isDraft = vigilanceArea.isDraft,
                links = vigilanceArea.links,
                linkedRegulatoryAreas = vigilanceArea.linkedRegulatoryAreas,
                name = vigilanceArea.name,
                source = vigilanceArea.source,
                startDatePeriod = vigilanceArea.startDatePeriod?.toInstant(),
                themes = vigilanceArea.themes,
                visibility = vigilanceArea.visibility,
            )
        }
    }
    fun toVigilanceAreaEntity(): VigilanceAreaEntity {
        return VigilanceAreaEntity(
            id = id,
            comments = comments,
            createdBy = createdBy,
            endingCondition = endingCondition,
            endingOccurrenceDate = endingOccurrenceDate?.atZone(UTC),
            endingOccurrencesNumber = endingOccurrencesNumber,
            frequency = frequency,
            endDatePeriod = endDatePeriod?.atZone(UTC),
            geom = geom,
            isDeleted = isDeleted,
            isDraft = isDraft,
            links = links,
            linkedRegulatoryAreas = linkedRegulatoryAreas,
            name = name,
            source = source,
            startDatePeriod = startDatePeriod?.atZone(UTC),
            themes = themes,
            visibility = visibility,
        )
    }
}
