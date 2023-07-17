package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.VehicleTypeEnum
import jakarta.persistence.Basic
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table
import org.hibernate.annotations.Type
import org.locationtech.jts.geom.Geometry
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC

@Entity
@Table(name = "reportings")
data class ReportingModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    var id: Int? = null,

    @Column(name = "source_type", columnDefinition = "reportings_source_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    var sourceType: SourceTypeEnum? = null,

    @Column(name = "semaphore_id")
    var semaphoreId: Int? = null,

    @Column(name = "control_unit_id")
    var controlUnitId: Int? = null,

    @Column(name = "source_name")
    var sourceName: String? = null,

    @Column(name = "target_type", columnDefinition = "reportings_target_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    var targetType: TargetTypeEnum? = null,

    @Column(name = "vehicle_type", columnDefinition = "reportings_vehicle_type")
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

    @Column(name = "report_type", columnDefinition = "reportings_report_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    var reportType: ReportingTypeEnum? = null,

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

    @Column(name = "is_archived", nullable = false)
    val isArchived: Boolean,

    @Column(name = "is_deleted", nullable = false)
    val isDeleted: Boolean,
) {

    fun toReporting() = ReportingEntity(
        id = id,
        sourceType = sourceType,
        semaphoreId = semaphoreId,
        controlUnitId = controlUnitId,
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
        isArchived = isArchived,
        isDeleted = isDeleted,
    )

    companion object {
        fun fromReportingEntity(reporting: ReportingEntity) = ReportingModel(
            id = reporting.id,
            sourceType = reporting.sourceType,
            semaphoreId = reporting.semaphoreId,
            controlUnitId = reporting.controlUnitId,
            sourceName = reporting.sourceName,
            targetType = reporting.targetType,
            vehicleType = reporting.vehicleType,
            targetDetails = reporting.targetDetails,
            geom = reporting.geom,
            description = reporting.description,
            reportType = reporting.reportType,
            theme = reporting.theme,
            subThemes = reporting.subThemes,
            actionTaken = reporting.actionTaken,
            isInfractionProven = reporting.isInfractionProven,
            isControlRequired = reporting.isControlRequired,
            isUnitAvailable = reporting.isUnitAvailable,
            createdAt = reporting.createdAt.toInstant(),
            validityTime = reporting.validityTime,
            isArchived = reporting.isArchived,
            isDeleted = reporting.isDeleted,
        )
    }
}
