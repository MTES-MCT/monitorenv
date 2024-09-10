package fr.gouv.cacem.monitorenv.infrastructure.database.model

import com.fasterxml.jackson.annotation.JsonBackReference
import com.fasterxml.jackson.annotation.JsonManagedReference
import com.fasterxml.jackson.databind.annotation.JsonDeserialize
import com.fasterxml.jackson.databind.annotation.JsonSerialize
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
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
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.NamedAttributeNode
import jakarta.persistence.NamedEntityGraph
import jakarta.persistence.NamedSubgraph
import jakarta.persistence.OneToMany
import jakarta.persistence.OrderBy
import jakarta.persistence.Table
import org.hibernate.annotations.Fetch
import org.hibernate.annotations.FetchMode
import org.hibernate.annotations.Formula
import org.hibernate.annotations.Generated
import org.hibernate.annotations.JdbcType
import org.hibernate.annotations.Type
import org.hibernate.annotations.UpdateTimestamp
import org.hibernate.dialect.PostgreSQLEnumJdbcType
import org.hibernate.generator.EventType
import org.hibernate.type.descriptor.jdbc.UUIDJdbcType
import org.locationtech.jts.geom.Geometry
import org.n52.jackson.datatype.jts.GeometryDeserializer
import org.n52.jackson.datatype.jts.GeometrySerializer
import java.time.Instant

@Entity
@Table(name = "reportings")
@NamedEntityGraph(
    name = "ReportingModel.fullLoad",
    attributeNodes =
    [
        NamedAttributeNode("reportingSources", subgraph = "subgraph.reportingSources"),
        NamedAttributeNode(
            "controlPlanSubThemes",
            subgraph = "subgraph.controlPlanSubThemes",
        ),
        NamedAttributeNode(
            "controlPlanTheme",
        ),
        NamedAttributeNode(
            "mission",
            subgraph = "subgraph.mission",
        ),
        NamedAttributeNode(
            "attachedEnvAction",
        ),
    ],
    subgraphs =
    [
        NamedSubgraph(
            name = "subgraph.reportingSources",
            attributeNodes =
            [
                NamedAttributeNode(
                    "controlUnit",
                ),
                NamedAttributeNode(
                    "semaphore",
                ),
            ],
        ),
        NamedSubgraph(
            name = "subgraph.mission",
            attributeNodes =
            [
                NamedAttributeNode(
                    "envActions",
                    subgraph = "subgraph.envActions",
                ),
                NamedAttributeNode(
                    "controlUnits",
                ),
                NamedAttributeNode(
                    "controlResources",
                ),
            ],
        ),
        NamedSubgraph(
            name = "subgraph.controlPlanSubThemes",
            attributeNodes =
            [
                NamedAttributeNode(
                    "controlPlanSubTheme",
                ),
            ],
        ),
        NamedSubgraph(
            name = "subgraph.envActions",
            attributeNodes =
            [
                NamedAttributeNode("controlPlanThemes"),
                NamedAttributeNode(
                    "controlPlanSubThemes",
                    subgraph =
                    "subgraph.linkedControlPlanSubThemes",
                ),
                NamedAttributeNode(
                    "controlPlanTags",
                    subgraph = "subgraph.linkedControlPlanTags",
                ),
                NamedAttributeNode("attachedReporting"),
            ],
        ),
        NamedSubgraph(
            name = "subgraph.linkedControlPlanSubThemes",
            attributeNodes =
            [
                NamedAttributeNode(
                    "controlPlanSubTheme",
                ),
            ],
        ),
        NamedSubgraph(
            name = "subgraph.linkedControlPlanTags",
            attributeNodes =
            [
                NamedAttributeNode(
                    "controlPlanTag",
                    subgraph = "subgraph.controlPlanTags",
                ),
            ],
        ),
        NamedSubgraph(
            name = "subgraph.controlPlanTags",
            attributeNodes =
            [
                NamedAttributeNode("controlPlanTheme"),
            ],
        ),
    ],
)
open class ReportingModelJpa(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true, nullable = false)
    override val id: Int? = null,
    @Generated(event = [EventType.INSERT])
    @Column(
        name = "reporting_id",
        unique = true,
        nullable = false,
        updatable = false,
        insertable = false,
    )
    override val reportingId: Long? = null,
    @OneToMany(
        mappedBy = "reporting",
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        fetch = FetchType.EAGER,
    )
    @JsonManagedReference
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("id")
    override val reportingSources: MutableList<ReportingSourceModel> = mutableListOf(),
    @Column(name = "target_type", columnDefinition = "reportings_target_type")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    override val targetType: TargetTypeEnum? = null,
    @Column(name = "vehicle_type", columnDefinition = "reportings_vehicle_type")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    override val vehicleType: VehicleTypeEnum? = null,
    @Column(name = "target_details", columnDefinition = "jsonb")
    @Type(JsonBinaryType::class)
    override val targetDetails: MutableList<TargetDetailsEntity>? = mutableListOf(),
    @JsonSerialize(using = GeometrySerializer::class)
    @JsonDeserialize(contentUsing = GeometryDeserializer::class)
    @Column(name = "geom")
    override val geom: Geometry? = null,
    @Column(name = "sea_front") override val seaFront: String? = null,
    @Column(name = "description") override val description: String? = null,
    @Column(name = "report_type", columnDefinition = "reportings_report_type")
    @Enumerated(EnumType.STRING)
    @JdbcType(PostgreSQLEnumJdbcType::class)
    override val reportType: ReportingTypeEnum? = null,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "control_plan_theme_id", nullable = true)
    override val controlPlanTheme: ControlPlanThemeModel? = null,
    @OneToMany(
        fetch = FetchType.LAZY,
        cascade = [CascadeType.ALL],
        orphanRemoval = true,
        mappedBy = "reporting",
    )
    @Fetch(value = FetchMode.SUBSELECT)
    @OrderBy("orderIndex")
    override val controlPlanSubThemes: MutableSet<ReportingsControlPlanSubThemeModel>? = LinkedHashSet(),
    @Column(name = "action_taken") override val actionTaken: String? = null,
    @Column(name = "is_control_required") override val isControlRequired: Boolean? = null,
    @Column(name = "has_no_unit_available") override val hasNoUnitAvailable: Boolean? = null,
    @Column(name = "created_at") override val createdAt: Instant,
    @Column(name = "validity_time") override val validityTime: Int? = null,
    @Column(name = "is_archived", nullable = false) override val isArchived: Boolean,
    @Column(name = "is_deleted", nullable = false) override val isDeleted: Boolean,
    @Column(name = "open_by") override val openBy: String? = null,
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mission_id", nullable = true)
    @JsonBackReference
    override val mission: MissionModel? = null,
    @Column(name = "attached_to_mission_at_utc") override val attachedToMissionAtUtc: Instant? = null,
    @Column(name = "detached_from_mission_at_utc")
    override val detachedFromMissionAtUtc: Instant? = null,
    @JdbcType(UUIDJdbcType::class)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(
        name = "attached_env_action_id",
        columnDefinition = "uuid",
        referencedColumnName = "id",
    )
    override val attachedEnvAction: EnvActionModel? = null,
    @Column(name = "updated_at_utc") @UpdateTimestamp override val updatedAtUtc: Instant? = null,
    @Column(name = "with_vhf_answer") override val withVHFAnswer: Boolean? = null,
    @Column(name = "is_infraction_proven") override val isInfractionProven: Boolean,
    @Formula("created_at + INTERVAL '1 hour' * validity_time")
    val validityEndTime: Instant? = null,
) : AbstractReportingModel(
    id = id,
    reportingId = reportingId,
    reportingSources = reportingSources,
    targetType = targetType,
    vehicleType = vehicleType,
    targetDetails = targetDetails,
    geom = geom,
    seaFront = seaFront,
    description = description,
    reportType = reportType,
    controlPlanTheme = controlPlanTheme,
    controlPlanSubThemes = controlPlanSubThemes,
    actionTaken = actionTaken,
    isControlRequired = isControlRequired,
    hasNoUnitAvailable = hasNoUnitAvailable,
    createdAt = createdAt,
    validityTime = validityTime,
    isArchived = isArchived,
    isDeleted = isDeleted,
    openBy = openBy,
    mission = mission,
    attachedToMissionAtUtc = attachedToMissionAtUtc,
    detachedFromMissionAtUtc = detachedFromMissionAtUtc,
    attachedEnvAction = attachedEnvAction,
    updatedAtUtc = updatedAtUtc,
    withVHFAnswer = withVHFAnswer,
    isInfractionProven = isInfractionProven,
)
