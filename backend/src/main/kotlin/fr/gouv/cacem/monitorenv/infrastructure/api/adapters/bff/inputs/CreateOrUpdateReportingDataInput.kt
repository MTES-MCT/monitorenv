package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class CreateOrUpdateReportingDataInput(
    val id: Int? = null,
    val reportingId: Long? = null,
    val sourceType: SourceTypeEnum? = null,
    val semaphoreId: Int? = null,
    val controlUnitId: Int? = null,
    val sourceName: String? = null,
    val targetType: TargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val targetDetails: List<TargetDetailsEntity>? = listOf(),
    val geom: Geometry? = null,
    val description: String? = null,
    val reportType: ReportingTypeEnum? = null,
    val theme: String? = null,
    val subThemes: List<String>? = listOf(),
    val actionTaken: String? = null,
    val isControlRequired: Boolean? = null,
    val hasNoUnitAvailable: Boolean? = null,
    val createdAt: ZonedDateTime,
    val validityTime: Int? = null,
    val isArchived: Boolean,
    val openBy: String? = null,
    val attachedMissionId: Int? = null,
    val attachedToMissionAtUtc: ZonedDateTime? = null,
    val detachedFromMissionAtUtc: ZonedDateTime? = null,
    val attachedEnvActionId: UUID? = null,
) {
    fun toReportingEntity(): ReportingEntity {
        return ReportingEntity(
            id = this.id,
            reportingId = this.reportingId,
            sourceType = this.sourceType,
            semaphoreId = this.semaphoreId,
            controlUnitId = this.controlUnitId,
            sourceName = this.sourceName,
            targetType = this.targetType,
            vehicleType = this.vehicleType,
            targetDetails = this.targetDetails,
            geom = this.geom,
            description = this.description,
            reportType = this.reportType,
            theme = this.theme,
            subThemes = this.subThemes,
            actionTaken = this.actionTaken,
            isControlRequired = this.isControlRequired,
            hasNoUnitAvailable = this.hasNoUnitAvailable,
            createdAt = this.createdAt,
            validityTime = this.validityTime,
            isArchived = this.isArchived,
            isDeleted = false,
            openBy = this.openBy,
            attachedMissionId = this.attachedMissionId,
            attachedToMissionAtUtc = this.attachedToMissionAtUtc,
            detachedFromMissionAtUtc = this.detachedFromMissionAtUtc,
            attachedEnvActionId = this.attachedEnvActionId,
        )
    }
}
