package fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class FullReportingDTO(
    val id: Int? = null,
    val reportingId: Int? = null,
    val sourceType: SourceTypeEnum? = null,
    val semaphoreId: Int? = null,
    val semaphore: SemaphoreEntity? = null,
    val controlUnitId: Int? = null,
    val controlUnit: FullControlUnitDTO? = null,
    val sourceName: String? = null,
    val displayedSource: String? = null,
    val targetType: TargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val targetDetails: List<TargetDetailsEntity>? = listOf(),
    val geom: Geometry? = null,
    val seaFront: String? = null,
    val description: String? = null,
    val reportType: ReportingTypeEnum? = null,
    val theme: String? = null,
    val subThemes: List<String>? = listOf(),
    val actionTaken: String? = null,
    val isControlRequired: Boolean? = null,
    val isUnitAvailable: Boolean? = null,
    val createdAt: ZonedDateTime,
    val validityTime: Int? = null,
    val isArchived: Boolean,
    val isDeleted: Boolean,
    val openBy: String? = null,
    val attachedMissionId: Int? = null,
    val attachedToMissionAtUtc: ZonedDateTime? = null,
    val detachedFromMissionAtUtc: ZonedDateTime? = null,
    val attachedEnvActionId: UUID? = null,
    val attachedMission: MissionEntity? = null,
    val attachedEnvAction: EnvActionEntity? = null,
) {
    fun toReportingEntity(): ReportingEntity =
        ReportingEntity(
            id = id,
            reportingId = reportingId,
            sourceType = sourceType,
            semaphoreId = semaphoreId,
            controlUnitId = controlUnitId,
            sourceName = sourceName,
            targetType = targetType,
            vehicleType = vehicleType,
            targetDetails = targetDetails,
            geom = geom,
            seaFront = seaFront,
            description = description,
            reportType = reportType,
            theme = theme,
            subThemes = subThemes,
            actionTaken = actionTaken,
            isControlRequired = isControlRequired,
            isUnitAvailable = isUnitAvailable,
            createdAt = createdAt,
            validityTime = validityTime,
            isArchived = isArchived,
            isDeleted = isDeleted,
            openBy = openBy,
            attachedMissionId = attachedMissionId,
            attachedToMissionAtUtc = attachedToMissionAtUtc,
            detachedFromMissionAtUtc = detachedFromMissionAtUtc,
            attachedEnvActionId = attachedEnvActionId,
        )
}
