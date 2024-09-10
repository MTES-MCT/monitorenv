package fr.gouv.cacem.monitorenv.infrastructure.database.model

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import jakarta.persistence.Entity
import org.hibernate.annotations.Formula
import org.locationtech.jts.geom.Geometry
import java.time.Instant

@Entity
class ReportingModelJpa(
    id: Int? = null,
    reportingId: Long? = null,
    reportingSources: MutableList<ReportingSourceModel> = mutableListOf(),
    targetType: TargetTypeEnum? = null,
    vehicleType: VehicleTypeEnum? = null,
    targetDetails: List<TargetDetailsEntity>? = listOf(),
    geom: Geometry? = null,
    seaFront: String? = null,
    description: String? = null,
    reportType: ReportingTypeEnum? = null,
    controlPlanTheme: ControlPlanThemeModel? = null,
    controlPlanSubThemes: MutableSet<ReportingsControlPlanSubThemeModel>? = LinkedHashSet(),
    actionTaken: String? = null,
    isControlRequired: Boolean? = null,
    hasNoUnitAvailable: Boolean? = null,
    createdAt: Instant,
    validityTime: Int? = null,
    isArchived: Boolean,
    isDeleted: Boolean,
    openBy: String? = null,
    mission: MissionModel? = null,
    attachedToMissionAtUtc: Instant? = null,
    detachedFromMissionAtUtc: Instant? = null,
    attachedEnvAction: EnvActionModel? = null,
    updatedAtUtc: Instant? = null,
    withVHFAnswer: Boolean? = null,
    isInfractionProven: Boolean,
    @Formula("created_at + INTERVAL '1 hour' * validity_time")
    val validityEndTime: Instant? = null,
) : ReportingModel(
    id,
    reportingId,
    reportingSources,
    targetType,
    vehicleType,
    targetDetails,
    geom,
    seaFront,
    description,
    reportType,
    controlPlanTheme,
    controlPlanSubThemes,
    actionTaken,
    isControlRequired,
    hasNoUnitAvailable,
    createdAt,
    validityTime,
    isArchived,
    isDeleted,
    openBy,
    mission,
    attachedToMissionAtUtc,
    detachedFromMissionAtUtc,
    attachedEnvAction,
    updatedAtUtc,
    withVHFAnswer,
    isInfractionProven,
)
