package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ControlStatusEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class ReportingsDataOutput(
    val id: Int,
    val reportingId: Long? = null,
    val sourceType: SourceTypeEnum? = null,
    val semaphoreId: Int? = null,
    val controlUnitId: Int? = null,
    val sourceName: String? = null,
    val displayedSource: String? = null,
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
    val controlStatus: ControlStatusEnum? = null,
    val withVHFAnswer: Boolean? = null,
) {
    companion object {
        fun fromReportingDTO(
            dto: ReportingDTO,
        ): ReportingsDataOutput {
            requireNotNull(dto.reporting.id) { "ReportingEntity.id cannot be null" }
            return ReportingsDataOutput(
                id = dto.reporting.id,
                reportingId = dto.reporting.reportingId,
                sourceType = dto.reporting.sourceType,
                semaphoreId = dto.reporting.semaphoreId,
                controlUnitId = dto.reporting.controlUnitId,
                sourceName = dto.reporting.sourceName,
                displayedSource =
                when (dto.reporting.sourceType) {
                    SourceTypeEnum.SEMAPHORE ->
                        dto?.semaphore?.unit
                            ?: dto?.semaphore?.name
                    // TODO This is really strange : `fullControlUnit?.controlUnit`
                    // can't be null and I have to add another `?`...
                    SourceTypeEnum.CONTROL_UNIT -> dto?.controlUnit?.controlUnit?.name
                    SourceTypeEnum.OTHER -> dto.reporting.sourceName
                    else -> ""
                },
                targetType = dto.reporting.targetType,
                vehicleType = dto.reporting.vehicleType,
                targetDetails = dto.reporting.targetDetails,
                geom = dto.reporting.geom,
                seaFront = dto.reporting.seaFront,
                description = dto.reporting.description,
                reportType = dto.reporting.reportType,
                themeId = dto.reporting.themeId,
                subThemeIds = dto.reporting.subThemeIds,
                actionTaken = dto.reporting.actionTaken,
                isControlRequired = dto.reporting.isControlRequired,
                hasNoUnitAvailable = dto.reporting.hasNoUnitAvailable,
                createdAt = dto.reporting.createdAt,
                validityTime = dto.reporting.validityTime,
                isArchived = dto.reporting.isArchived,
                openBy = dto.reporting.openBy,
                missionId = dto.reporting.missionId,
                attachedToMissionAtUtc = dto.reporting.attachedToMissionAtUtc,
                detachedFromMissionAtUtc = dto.reporting.detachedFromMissionAtUtc,
                attachedEnvActionId = dto.reporting.attachedEnvActionId,
                controlStatus = dto.controlStatus,
                withVHFAnswer = dto.reporting.withVHFAnswer,
            )
        }
    }
}
