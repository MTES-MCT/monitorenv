package fr.gouv.cacem.monitorenv.infrastructure.database.model.reportings

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingsDTO
import fr.gouv.cacem.monitorenv.infrastructure.database.model.*
import io.hypersistence.utils.hibernate.type.json.JsonBinaryType
import jakarta.persistence.*
import jakarta.persistence.CascadeType
import jakarta.persistence.OrderBy
import org.hibernate.Hibernate
import org.hibernate.annotations.*
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import org.hibernate.generator.EventType
import org.hibernate.type.descriptor.jdbc.UUIDJdbcType
import org.locationtech.jts.geom.Geometry
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant
import java.time.ZoneOffset.UTC

@MappedSuperclass
abstract class AbstractReportingModel(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    open val id: Int? = null,
    @Generated(event = [EventType.INSERT])
    @Column(
        name = "reporting_id",
        unique = true,
        nullable = false,
        updatable = false,
        insertable = false,
    )
    open val reportingId: Long? = null,
    @OneToMany(
        mappedBy = "reporting",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.EAGER,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("id")
    open val reportingSources: MutableSet<ReportingSourceModel> = LinkedHashSet(),
    @Column(name = "target_type", columnDefinition = "reportings_target_type")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    open val targetType: TargetTypeEnum? = null,
    @Column(name = "vehicle_type", columnDefinition = "reportings_vehicle_type")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    open val vehicleType: VehicleTypeEnum? = null,
    @Column(name = "target_details", columnDefinition = "jsonb")
    @Type(JsonBinaryType::class)
    open val targetDetails: List<TargetDetailsEntity>? = listOf(),
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    open val geom: Geometry? = null,
    @Column(name = "sea_front") open val seaFront: String? = null,
    @Column(name = "description") open val description: String? = null,
    @Column(name = "report_type", columnDefinition = "reportings_report_type")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    open val reportType: ReportingTypeEnum? = null,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "control_plan_theme_id", nullable = true)
    open val controlPlanTheme: ControlPlanThemeModel? = null,
    @OneToMany(
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        mappedBy = "reporting",
    )
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("orderIndex")
    open val controlPlanSubThemes: MutableSet<ReportingsControlPlanSubThemeModel>? = LinkedHashSet(),
    @Column(name = "action_taken") open val actionTaken: String? = null,
    @Column(name = "is_control_required") open val isControlRequired: Boolean? = null,
    @Column(name = "has_no_unit_available") open val hasNoUnitAvailable: Boolean? = null,
    @Column(name = "created_at") open val createdAt: Instant,
    @Column(name = "validity_time") open val validityTime: Int? = null,
    @Column(name = "is_archived", nullable = false) open val isArchived: Boolean,
    @Column(name = "is_deleted", nullable = false) open val isDeleted: Boolean,
    @Column(name = "open_by") open val openBy: String? = null,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mission_id", nullable = true)
    @JsonBackReference
    open val mission: MissionModel? = null,
    @Column(name = "attached_to_mission_at_utc") open val attachedToMissionAtUtc: Instant? = null,
    @Column(name = "detached_from_mission_at_utc")
    open val detachedFromMissionAtUtc: Instant? = null,
    @JdbcType(UUIDJdbcType::class)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "attached_env_action_id",
        columnDefinition = "uuid",
        referencedColumnName = "id",
    )
    open val attachedEnvAction: EnvActionModel? = null,
    @Column(name = "updated_at_utc") @UpdateTimestamp open val updatedAtUtc: Instant? = null,
    @Column(name = "with_vhf_answer") open val withVHFAnswer: Boolean? = null,
    @Column(name = "is_infraction_proven") open val isInfractionProven: Boolean,
) {
    fun toReporting() =
        ReportingEntity(
            id = id,
            reportingId = reportingId,
            reportingSources = reportingSources.map { it.toReportingSource() },
            targetType = targetType,
            vehicleType = vehicleType,
            targetDetails = targetDetails,
            geom = geom,
            seaFront = seaFront,
            description = description,
            reportType = reportType,
            themeId = controlPlanTheme?.id,
            subThemeIds = controlPlanSubThemes?.map { it.id.subthemeId },
            actionTaken = actionTaken,
            isControlRequired = isControlRequired,
            hasNoUnitAvailable = hasNoUnitAvailable,
            createdAt = createdAt.atZone(UTC),
            validityTime = validityTime,
            isArchived = isArchived,
            isDeleted = isDeleted,
            openBy = openBy,
            missionId = mission?.id,
            attachedToMissionAtUtc = attachedToMissionAtUtc?.atZone(UTC),
            detachedFromMissionAtUtc = detachedFromMissionAtUtc?.atZone(UTC),
            attachedEnvActionId = attachedEnvAction?.id,
            updatedAtUtc = updatedAtUtc?.atZone(UTC),
            withVHFAnswer = withVHFAnswer,
            isInfractionProven = isInfractionProven,
        )

    fun toReportingsDTO(objectMapper: ObjectMapper): ReportingsDTO {
        val reporting = this.toReporting()
        return ReportingsDTO(
            reporting = reporting,
            reportingSources = reportingSources.map { it.toReportingSourceDTO() },
            attachedMission =
                if (detachedFromMissionAtUtc == null && attachedToMissionAtUtc != null
                ) {
                    mission?.toMissionEntityWithoutControlUnit(
                        objectMapper,
                    )
                } else {
                    null
                },
        )
    }

    fun toReportingDTO(objectMapper: ObjectMapper): ReportingDTO {
        val reporting = this.toReporting()
        return ReportingDTO(
            reporting = reporting,
            reportingSources = reportingSources.map { it.toReportingSourceDTO() },
            attachedMission =
                if (detachedFromMissionAtUtc == null && attachedToMissionAtUtc != null
                ) {
                    mission?.toMissionEntity(
                        objectMapper,
                    )
                } else {
                    null
                },
            detachedMission =
                if (detachedFromMissionAtUtc != null) {
                    mission?.toMissionEntity(
                        objectMapper,
                    )
                } else {
                    null
                },
        )
    }

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false
        other as AbstractReportingModel

        return id != null && id == other.id
    }

    override fun hashCode(): Int = javaClass.hashCode()

    companion object {
        fun fromReportingEntity(
            reporting: ReportingEntity,
            missionReference: MissionModel?,
            envActionReference: EnvActionModel?,
            controlPlanThemeReference: ControlPlanThemeModel?,
        ) = ReportingModel(
            id = reporting.id,
            reportingId = reporting.reportingId,
            targetType = reporting.targetType,
            vehicleType = reporting.vehicleType,
            targetDetails = reporting.targetDetails,
            geom = reporting.geom,
            seaFront = reporting.seaFront,
            description = reporting.description,
            reportType = reporting.reportType,
            controlPlanTheme = controlPlanThemeReference,
            actionTaken = reporting.actionTaken,
            isControlRequired = reporting.isControlRequired,
            hasNoUnitAvailable = reporting.hasNoUnitAvailable,
            createdAt = reporting.createdAt.toInstant(),
            validityTime = reporting.validityTime,
            isArchived = reporting.isArchived,
            isDeleted = reporting.isDeleted,
            openBy = reporting.openBy,
            mission = missionReference,
            attachedToMissionAtUtc = reporting.attachedToMissionAtUtc?.toInstant(),
            detachedFromMissionAtUtc = reporting.detachedFromMissionAtUtc?.toInstant(),
            attachedEnvAction = envActionReference,
            updatedAtUtc = reporting.updatedAtUtc?.toInstant(),
            withVHFAnswer = reporting.withVHFAnswer,
            isInfractionProven = reporting.isInfractionProven,
        )
    }
}
