package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingSourceDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingSourceDataOutput.Companion.fromReportingSourceDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput.Companion.fromTagEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput.Companion.fromThemeEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class MissionAttachedReportingDataOutput(
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
    val attachedToMissionAtUtc: ZonedDateTime? = null,
    val detachedFromMissionAtUtc: ZonedDateTime? = null,
    val attachedEnvActionId: UUID? = null,
    val missionId: Int? = null,
    val theme: ThemeOutput,
    val tags: List<TagOutput>,
) {
    companion object {
        fun fromReportingDTO(dto: ReportingDetailsDTO): MissionAttachedReportingDataOutput {
            requireNotNull(dto.reporting.id) { "ReportingEntity.id cannot be null" }
            return MissionAttachedReportingDataOutput(
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
                missionId = dto.reporting.missionId,
                tags = dto.reporting.tags.map { fromTagEntity(it) },
                theme = fromThemeEntity(dto.reporting.theme),
            )
        }
    }
}
