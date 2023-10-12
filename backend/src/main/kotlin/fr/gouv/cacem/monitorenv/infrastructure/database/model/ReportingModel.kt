package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import com.vladmihalcea.hibernate.type.array.ListArrayType
import com.vladmihalcea.hibernate.type.basic.PostgreSQLEnumType
import com.vladmihalcea.hibernate.type.json.JsonBinaryType
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.FullReportingDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import org.hibernate.Hibernate
import org.hibernate.annotations.Generated
import org.hibernate.annotations.GenerationTime
import org.hibernate.annotations.JdbcType
import org.hibernate.annotations.Type
import org.hibernate.type.descriptor.jdbc.UUIDJdbcType
import org.locationtech.jts.geom.Geometry
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC
import java.util.UUID

@Entity
@Table(name = "reportings")
data class ReportingModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    val id: Int? = null,
    @Generated(GenerationTime.INSERT)
    @Column(
        name = "reporting_id",
        unique = true,
        nullable = false,
        updatable = false,
        insertable = false,
    )
    val reportingId: Int? = null,
    @Column(name = "source_type", columnDefinition = "reportings_source_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    val sourceType: SourceTypeEnum? = null,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "semaphore_id", nullable = true)
    @JsonBackReference
    val semaphore: SemaphoreModel? = null,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "control_unit_id", nullable = true)
    @JsonBackReference
    val controlUnit: ControlUnitModel? = null,
    @Column(name = "source_name")
    val sourceName: String? = null,
    @Column(name = "target_type", columnDefinition = "reportings_target_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    val targetType: TargetTypeEnum? = null,
    @Column(name = "vehicle_type", columnDefinition = "reportings_vehicle_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    val vehicleType: VehicleTypeEnum? = null,
    @Column(name = "target_details", columnDefinition = "jsonb")
    @Type(JsonBinaryType::class)
    val targetDetails: List<TargetDetailsEntity>? = listOf(),
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    val geom: Geometry? = null,
    @Column(name = "sea_front")
    val seaFront: String? = null,
    @Column(name = "description")
    val description: String? = null,
    @Column(name = "report_type", columnDefinition = "reportings_report_type")
    @Enumerated(EnumType.STRING)
    @Type(PostgreSQLEnumType::class)
    val reportType: ReportingTypeEnum? = null,
    @Column(name = "theme")
    val theme: String? = null,
    @Column(name = "sub_themes")
    @Type(ListArrayType::class)
    val subThemes: List<String>? = listOf(),
    @Column(name = "action_taken")
    val actionTaken: String? = null,
    @Column(name = "is_control_required")
    val isControlRequired: Boolean? = null,
    @Column(name = "is_unit_available")
    val isUnitAvailable: Boolean? = null,
    @Column(name = "created_at")
    val createdAt: Instant,
    @Column(name = "validity_time")
    val validityTime: Int? = null,
    @Column(name = "is_archived", nullable = false)
    val isArchived: Boolean,
    @Column(name = "is_deleted", nullable = false)
    val isDeleted: Boolean,
    @Column(name = "open_by")
    val openBy: String? = null,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "attached_mission_id", nullable = true)
    @JsonBackReference
    val attachedMission: MissionModel? = null,
    @Column(name = "attached_to_mission_at_utc")
    val attachedToMissionAtUtc: Instant? = null,
    @Column(name = "detached_from_mission_at_utc")
    val detachedFromMissionAtUtc: Instant? = null,
    @JdbcType(UUIDJdbcType::class)
    @Column(name = "attached_env_action_id", columnDefinition = "uuid")
    val attachedEnvActionId: UUID? = null,
) {

    fun toReporting() =
        ReportingEntity(
            id = id,
            reportingId = reportingId,
            sourceType = sourceType,
            semaphoreId = semaphore?.id,
            controlUnitId = controlUnit?.id,
            sourceName = sourceName,
            targetType = targetType,
            vehicleType = vehicleType,
            targetDetails = targetDetails,
            geom = geom,
            seaFront = seaFront,
            description = description,
            reportType = reportType,
            theme = theme,
            subThemes = subThemes,
            actionTaken = actionTaken,
            isControlRequired = isControlRequired,
            isUnitAvailable = isUnitAvailable,
            createdAt = createdAt.atZone(UTC),
            validityTime = validityTime,
            isArchived = isArchived,
            isDeleted = isDeleted,
            openBy = openBy,
            attachedMissionId = attachedMission?.id,
            attachedToMissionAtUtc = attachedToMissionAtUtc?.atZone(UTC),
            detachedFromMissionAtUtc = detachedFromMissionAtUtc?.atZone(UTC),
            attachedEnvActionId = attachedEnvActionId,
        )
    fun toFullReporting(objectMapper: ObjectMapper) = FullReportingDTO(
        id = id,
        reportingId = reportingId,
        sourceType = sourceType,
        semaphoreId = semaphore?.id,
        controlUnitId = controlUnit?.id,
        sourceName = sourceName,
        targetType = targetType,
        vehicleType = vehicleType,
        targetDetails = targetDetails,
        geom = geom,
        seaFront = seaFront,
        description = description,
        reportType = reportType,
        theme = theme,
        subThemes = subThemes,
        actionTaken = actionTaken,
        isControlRequired = isControlRequired,
        isUnitAvailable = isUnitAvailable,
        createdAt = createdAt.atZone(UTC),
        validityTime = validityTime,
        isArchived = isArchived,
        isDeleted = isDeleted,
        openBy = openBy,
        attachedMission = attachedMission?.toMissionEntity(objectMapper),
        attachedMissionId = attachedMission?.id,
        attachedToMissionAtUtc = attachedToMissionAtUtc?.atZone(UTC),
        detachedFromMissionAtUtc = detachedFromMissionAtUtc?.atZone(UTC),
        attachedEnvActionId = attachedEnvActionId,
    )

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as ReportingModel

        return id != null && id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()

    companion object {
        fun fromReportingEntity(
            reporting: ReportingEntity,
            semaphoreReference: SemaphoreModel?,
            controlUnitReference: ControlUnitModel?,
            attachedMissionReference: MissionModel?,
        ) =
            ReportingModel(
                id = reporting.id,
                reportingId = reporting.reportingId,
                sourceType = reporting.sourceType,
                semaphore = semaphoreReference,
                controlUnit = controlUnitReference,
                sourceName = reporting.sourceName,
                targetType = reporting.targetType,
                vehicleType = reporting.vehicleType,
                targetDetails = reporting.targetDetails,
                geom = reporting.geom,
                seaFront = reporting.seaFront,
                description = reporting.description,
                reportType = reporting.reportType,
                theme = reporting.theme,
                subThemes = reporting.subThemes,
                actionTaken = reporting.actionTaken,
                isControlRequired = reporting.isControlRequired,
                isUnitAvailable = reporting.isUnitAvailable,
                createdAt = reporting.createdAt.toInstant(),
                validityTime = reporting.validityTime,
                isArchived = reporting.isArchived,
                isDeleted = reporting.isDeleted,
                openBy = reporting.openBy,
                attachedMission = attachedMissionReference,
                attachedToMissionAtUtc = reporting.attachedToMissionAtUtc?.toInstant(),
                detachedFromMissionAtUtc = reporting.detachedFromMissionAtUtc?.toInstant(),
                attachedEnvActionId = reporting.attachedEnvActionId,
            )
    }
}
