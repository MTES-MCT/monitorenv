package fr.gouv.cacem.monitorenv.infrastructure.database.model.reportings

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlPlanThemeModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.EnvActionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingSourceModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingsControlPlanSubThemeModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.TagReportingModel
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ThemeReportingModel
import jakarta.persistence.Entity
import jakarta.persistence.Table
import org.locationtech.jts.geom.Geometry
import java.time.Instant

/**
 *
 * For native queries prupose only
 * For JPQL queries you should use [ReportingModelJpa]
 */
@Entity
@Table(name = "reportings")
class ReportingModel(
    override val id: Int? = null,
    override val reportingId: Long? = null,
    override val reportingSources: MutableSet<ReportingSourceModel> = LinkedHashSet(),
    override val targetType: TargetTypeEnum? = null,
    override val vehicleType: VehicleTypeEnum? = null,
    override val targetDetails: List<TargetDetailsEntity>? = listOf(),
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
        tags = tags,
        themes = themes,
    )
