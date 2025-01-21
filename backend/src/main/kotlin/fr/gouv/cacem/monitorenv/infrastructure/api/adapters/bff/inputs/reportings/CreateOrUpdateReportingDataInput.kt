package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class CreateOrUpdateReportingDataInput(
    val id: Int? = null,
    val reportingId: Long? = null,
    val reportingSources: List<ReportingSourceDataInput>,
    val targetType: TargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val targetDetails: List<TargetDetailsEntity>? = listOf(),
    val geom: Geometry? = null,
    val description: String? = null,
    val reportType: ReportingTypeEnum,
    val themeId: Int,
    val subThemeIds: List<Int>,
    val actionTaken: String? = null,
    val isControlRequired: Boolean? = null,
    val hasNoUnitAvailable: Boolean? = null,
    val createdAt: ZonedDateTime,
    val validityTime: Int? = null,
    val isArchived: Boolean,
    val openBy: String? = null,
    val missionId: Int? = null,
    val attachedToMissionAtUtc: ZonedDateTime? = null,
    val detachedFromMissionAtUtc: ZonedDateTime? = null,
    val attachedEnvActionId: UUID? = null,
    val updatedAtUtc: ZonedDateTime? = null,
    val withVHFAnswer: Boolean? = null,
    val isInfractionProven: Boolean,
) {
    fun toReportingEntity(): ReportingEntity {
        return ReportingEntity(
            id = this.id,
            reportingId = this.reportingId,
            reportingSources = reportingSources.map { it.toReportingSourceEntity() },
            targetType = this.targetType,
            vehicleType = this.vehicleType,
            targetDetails = this.targetDetails,
            geom = this.geom,
            description = this.description,
            reportType = this.reportType,
            themeId = this.themeId,
            subThemeIds = this.subThemeIds,
            actionTaken = this.actionTaken,
            isControlRequired = this.isControlRequired,
            hasNoUnitAvailable = this.hasNoUnitAvailable,
            createdAt = this.createdAt,
            validityTime = this.validityTime,
            isArchived = this.isArchived,
            isDeleted = false,
            openBy = this.openBy,
            missionId = this.missionId,
            attachedToMissionAtUtc = this.attachedToMissionAtUtc,
            detachedFromMissionAtUtc = this.detachedFromMissionAtUtc,
            attachedEnvActionId = this.attachedEnvActionId,
            updatedAtUtc = this.updatedAtUtc,
            withVHFAnswer = this.withVHFAnswer,
            isInfractionProven = this.isInfractionProven,
        )
    }
}
