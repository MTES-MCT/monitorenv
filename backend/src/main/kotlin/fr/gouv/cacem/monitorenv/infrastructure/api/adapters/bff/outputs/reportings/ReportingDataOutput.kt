package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ControlStatusEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingSourceDataOutput.Companion.fromReportingSourceDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput.Companion.fromTagEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput.Companion.fromThemeEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class ReportingDataOutput(
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
    val attachedMission: ReportingMissionDataOutput? = null,
    val controlStatus: ControlStatusEnum? = null,
    val updatedAtUtc: ZonedDateTime? = null,
    val withVHFAnswer: Boolean? = null,
    val isInfractionProven: Boolean,
    val theme: ThemeOutput,
    val tags: List<TagOutput>,
) {
    companion object {
        fun fromReportingDTO(dto: ReportingDetailsDTO): ReportingDataOutput {
            requireNotNull(dto.reporting.id) { "ReportingEntity.id cannot be null" }
            return ReportingDataOutput(
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
                missionId = dto.reporting.missionId,
                attachedToMissionAtUtc = dto.reporting.attachedToMissionAtUtc,
                detachedFromMissionAtUtc = dto.reporting.detachedFromMissionAtUtc,
                attachedEnvActionId = dto.reporting.attachedEnvActionId,
                attachedMission =
                    if (dto.attachedMission != null) {
                        ReportingMissionDataOutput.fromMission(
                            dto.attachedMission,
                        )
                    } else {
                        null
                    },
                controlStatus = dto.controlStatus,
                updatedAtUtc = dto.reporting.updatedAtUtc,
                withVHFAnswer = dto.reporting.withVHFAnswer,
                isInfractionProven = dto.reporting.isInfractionProven,
                tags = dto.reporting.tags.map { fromTagEntity(it) },
                theme = fromThemeEntity(dto.reporting.theme),
            )
        }
    }
}
