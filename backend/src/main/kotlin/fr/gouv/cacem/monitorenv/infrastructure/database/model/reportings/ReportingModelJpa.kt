package fr.gouv.cacem.monitorenv.infrastructure.database.model.reportings

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.infrastructure.database.model.EnvActionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingSourceModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagReportingModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeReportingModel
import jakarta.persistence.Entity
import jakarta.persistence.NamedAttributeNode
import jakarta.persistence.NamedEntityGraph
import jakarta.persistence.NamedSubgraph
import jakarta.persistence.Table
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
                "mission",
                subgraph = "subgraph.mission",
            ),
            NamedAttributeNode(
                "attachedEnvAction",
            ),
            NamedAttributeNode("themes"),
            NamedAttributeNode("tags"),
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
    override var tags: MutableSet<TagReportingModel>,
    override var themes: MutableSet<ThemeReportingModel>,
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
        tags = tags,
        themes = themes,
    )
