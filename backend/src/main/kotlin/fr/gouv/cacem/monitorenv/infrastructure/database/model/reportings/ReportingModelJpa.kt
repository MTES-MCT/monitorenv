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
            NamedAttributeNode("mission", subgraph = "subgraph.mission"),
            NamedAttributeNode(
                "attachedEnvAction",
                subgraph = "subgraph.envActions",
            ),
            NamedAttributeNode("themes", subgraph = "subgraph.themesReportings"),
            NamedAttributeNode("tags", subgraph = "subgraph.tagsReportings"),
        ],
    subgraphs =
        [
            NamedSubgraph(
                name = "subgraph.reportingSources",
                attributeNodes =
                    [
                        NamedAttributeNode("controlUnit"),
                        NamedAttributeNode("semaphore"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.mission",
                attributeNodes =
                    [
                        NamedAttributeNode("envActions", subgraph = "subgraph.envActions"),
                        NamedAttributeNode("controlUnits"),
                        NamedAttributeNode("controlResources"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.envActions",
                attributeNodes =
                    [
                        NamedAttributeNode(
                            "themes",
                            subgraph = "subgraph.themesEnvAction",
                        ),
                        NamedAttributeNode(
                            "tags",
                            subgraph = "subgraph.tagsEnvAction",
                        ),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.themesReportings",
                attributeNodes =
                    [
                        NamedAttributeNode("reporting"),
                        NamedAttributeNode("theme", subgraph = "subgraph.themes"),

                    ],
            ),
            NamedSubgraph(
                name = "subgraph.tagsReportings",
                attributeNodes =
                    [
                        NamedAttributeNode("reporting"),
                        NamedAttributeNode("tag", subgraph = "subgraph.tags"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.themesEnvAction",
                attributeNodes =
                    [
                        NamedAttributeNode("envAction"),
                        NamedAttributeNode("theme", subgraph = "subgraph.themes"),

                    ],
            ),
            NamedSubgraph(
                name = "subgraph.tagsEnvAction",
                attributeNodes =
                    [
                        NamedAttributeNode("envAction"),
                        NamedAttributeNode("tag", subgraph = "subgraph.tags"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.themes",
                attributeNodes =
                    [
                        NamedAttributeNode("parent"),
                    ],
            ),
            NamedSubgraph(
                name = "subgraph.tags",
                attributeNodes =
                    [
                        NamedAttributeNode("parent"),
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
