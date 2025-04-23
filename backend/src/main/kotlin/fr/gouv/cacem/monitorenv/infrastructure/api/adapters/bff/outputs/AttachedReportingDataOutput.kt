package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingSourceDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingSourceDataOutput.Companion.fromReportingSourceDTO
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class AttachedReportingDataOutput(
    val id: Int,
    val reportingId: Long? = null,
    val reportingSources: List<ReportingSourceDataOutput>,
    val targetType: TargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val targetDetails: List<TargetDetailsEntity>? = listOf(),
    val geom: Geometry? = null,
    val seaFront: String? = null,
    val description: String? = null,
    val reportType: ReportingTypeEnum? = null,
    val themeId: Int? = null,
    val subThemeIds: List<Int>? = emptyList(),
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
    val withVHFAnswer: Boolean? = null,
) {
    companion object {
        fun fromReportingDTO(dto: ReportingDetailsDTO): AttachedReportingDataOutput {
            requireNotNull(dto.reporting.id) { "ReportingEntity.id cannot be null" }
            return AttachedReportingDataOutput(
                id = dto.reporting.id,
                reportingId = dto.reporting.reportingId,
                reportingSources = dto.reportingSources.map { fromReportingSourceDTO(it) },
                targetType = dto.reporting.targetType,
                vehicleType = dto.reporting.vehicleType,
                targetDetails = dto.reporting.targetDetails,
                geom = dto.reporting.geom,
                seaFront = dto.reporting.seaFront,
                description = dto.reporting.description,
                reportType = dto.reporting.reportType,
                actionTaken = dto.reporting.actionTaken,
                isControlRequired = dto.reporting.isControlRequired,
                hasNoUnitAvailable = dto.reporting.hasNoUnitAvailable,
                createdAt = dto.reporting.createdAt,
                validityTime = dto.reporting.validityTime,
                isArchived = dto.reporting.isArchived,
                openBy = dto.reporting.openBy,
                attachedToMissionAtUtc = dto.reporting.attachedToMissionAtUtc,
                detachedFromMissionAtUtc = dto.reporting.detachedFromMissionAtUtc,
                attachedEnvActionId = dto.reporting.attachedEnvActionId,
                withVHFAnswer = dto.reporting.withVHFAnswer,
            )
        }
    }
}
