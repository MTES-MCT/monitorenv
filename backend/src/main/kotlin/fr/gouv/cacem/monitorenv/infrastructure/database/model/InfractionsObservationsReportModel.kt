package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.ReportTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.VehicleTypeEnum
import jakarta.persistence.Basic
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.hibernate.annotations.Type
import org.locationtech.jts.geom.Geometry
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC

@Entity
@Table(name = "infractions_observations_reports")
data class InfractionsObservationsReportModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Basic(optional = false)
    @Column(name = "id", unique = true, nullable = false)
    var id: Int,

    @Column(name = "source_type", columnDefinition = "infractions_observations_reports_source_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    var sourceType: SourceTypeEnum? = null,

    @Column(name = "source_name")
    var sourceName: String? = null,

    @Column(name = "target_type", columnDefinition = "infractions_observations_reports_target_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    var targetType: TargetTypeEnum? = null,

    @Column(name = "vehicle_type", columnDefinition = "infractions_observations_reports_vehicle_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    var vehicleType: VehicleTypeEnum? = null,

    @Column(name = "target_details", columnDefinition = "jsonb")
    @Type(JsonBinaryType::class)
    var targetDetails: TargetDetailsEntity? = null,

    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    var geom: Geometry? = null,

    @Column(name = "description")
    var description: String? = null,

    @Column(name = "report_type", columnDefinition = "infractions_observations_reports_report_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    var reportType: ReportTypeEnum? = null,

    @Column(name = "theme")
    var theme: String? = null,

    @Column(name = "sub_themes")
    @Type(ListArrayType::class)
    var subThemes: List<String>? = listOf(),

    @Column(name = "action_taken")
    var actionTaken: String? = null,

    @Column(name = "is_infraction_proven")
    var isInfractionProven: Boolean? = null,

    @Column(name = "is_control_required")
    var isControlRequired: Boolean? = null,

    @Column(name = "is_unit_available")
    var isUnitAvailable: Boolean? = null,

    @Column(name = "created_at")
    var createdAt: Instant,

    @Column(name = "validity_time")
    var validityTime: Int? = null,

    @Column(name = "is_deleted", nullable = false)
    val isDeleted: Boolean,
) {

    fun toInfractionsObservationsReport() = InfractionsObservationsReportEntity(
        id = id,
        sourceType = sourceType,
        sourceName = sourceName,
        targetType = targetType,
        vehicleType = vehicleType,
        targetDetails = targetDetails,
        geom = geom,
        description = description,
        reportType = reportType,
        theme = theme,
        subThemes = subThemes,
        actionTaken = actionTaken,
        isInfractionProven = isInfractionProven,
        isControlRequired = isControlRequired,
        isUnitAvailable = isUnitAvailable,
        createdAt = createdAt.atZone(UTC),
        validityTime = validityTime,
        isDeleted = isDeleted,
    )

    companion object {
        fun fromInfractionsObservationsReportEntity(entity: InfractionsObservationsReportEntity) = InfractionsObservationsReportModel(
            id = entity.id,
            sourceType = entity.sourceType,
            sourceName = entity.sourceName,
            targetType = entity.targetType,
            vehicleType = entity.vehicleType,
            targetDetails = entity.targetDetails,
            geom = entity.geom,
            description = entity.description,
            reportType = entity.reportType,
            theme = entity.theme,
            subThemes = entity.subThemes,
            actionTaken = entity.actionTaken,
            isInfractionProven = entity.isInfractionProven,
            isControlRequired = entity.isControlRequired,
            isUnitAvailable = entity.isUnitAvailable,
            createdAt = entity.createdAt.toInstant(),
            validityTime = entity.validityTime,
            isDeleted = entity.isDeleted,
        )
    }
}
