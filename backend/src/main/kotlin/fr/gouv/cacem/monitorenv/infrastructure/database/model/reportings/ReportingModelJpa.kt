package fr.gouv.cacem.monitorenv.infrastructure.database.model.reportings

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.infrastructure.database.model.*
import jakarta.persistence.*
import org.hibernate.annotations.Formula
import org.locationtech.jts.geom.Geometry
import java.time.Instant

/**
 * For JPQL queries purpose only
 * For native queries you should use [ReportingModel]
 */
@Entity
@Table(name = "reportings")
@NamedEntityGraph(
    name = "ReportingModel.fullLoad",
    attributeNodes =
        [
            NamedAttributeNode("reportingSources", subgraph = "subgraph.reportingSources"),
            NamedAttributeNode(
                "controlPlanSubThemes",
                subgraph = "subgraph.reportingControlPlanSubThemes",
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
                        NamedAttributeNode("controlUnit", subgraph = "subgraph.controlUnit"),
                        NamedAttributeNode("semaphore"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.mission",
                attributeNodes =
                    [
                        NamedAttributeNode("attachedReportings"),
                        NamedAttributeNode("envActions", subgraph = "subgraph.envActions"),
                        NamedAttributeNode("controlUnits", subgraph = "subgraph.missionControlUnit"),
                        NamedAttributeNode("controlResources"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.envActions",
                attributeNodes =
                    [
                        NamedAttributeNode("controlPlanThemes"),
                        NamedAttributeNode("controlPlanSubThemes"),
                        NamedAttributeNode("controlPlanTags"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.reportingControlPlanSubThemes",
                attributeNodes =
                    [
                        NamedAttributeNode("controlPlanSubTheme"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.controlPlanTags",
                attributeNodes =
                    [
                        NamedAttributeNode("controlPlanTheme"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.missionControlUnit",
                attributeNodes =
                    [
                        NamedAttributeNode("mission"),
                        NamedAttributeNode("unit"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.controlUnit",
                attributeNodes =
                    [
                        NamedAttributeNode("administration"),
                        NamedAttributeNode("controlUnitResources"),
                        NamedAttributeNode("controlUnitContacts"),
                    ],
            ),
        ],
)
open class ReportingModelJpa(
    override val id: Int? = null,
    override val reportingId: Long? = null,
    override val reportingSources: MutableSet<ReportingSourceModel> = LinkedHashSet(),
    override val targetType: TargetTypeEnum? = null,
    override val vehicleType: VehicleTypeEnum? = null,
    override val targetDetails: MutableList<TargetDetailsEntity>? = mutableListOf(),
    override val geom: Geometry? = null,
    override val seaFront: String? = null,
    override val description: String? = null,
    override val reportType: ReportingTypeEnum? = null,
    override val controlPlanTheme: ControlPlanThemeModel? = null,
    override val controlPlanSubThemes: MutableSet<ReportingsControlPlanSubThemeModel>? = LinkedHashSet(),
    override val actionTaken: String? = null,
    override val isControlRequired: Boolean? = null,
    override val hasNoUnitAvailable: Boolean? = null,
    override val createdAt: Instant,
    override val validityTime: Int? = null,
    override val isArchived: Boolean,
    override val isDeleted: Boolean,
    override val openBy: String? = null,
    override val mission: MissionModel? = null,
    override val attachedToMissionAtUtc: Instant? = null,
    override val detachedFromMissionAtUtc: Instant? = null,
    override val attachedEnvAction: EnvActionModel? = null,
    override val updatedAtUtc: Instant? = null,
    override val withVHFAnswer: Boolean? = null,
    override val isInfractionProven: Boolean,
    @Formula("created_at + INTERVAL '1 hour' * validity_time")
    open val validityEndTime: Instant? = null,
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
