package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import fr.gouv.cacem.monitorenv.domain.mappers.EnvActionMapper
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.FullControlUnitDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.FullReportingDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.ControlUnitDataOutput
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class ReportingDataOutput(
    val id: Int,
    val reportingId: Int? = null,
    val sourceType: SourceTypeEnum? = null,
    val semaphoreId: Int? = null,
    val semaphore: SemaphoreDataOutput? = null,
    val controlUnitId: Int? = null,
    val controlUnit: ControlUnitDataOutput? = null,
    val sourceName: String? = null,
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
    val openBy: String? = null,
    val attachedMissionId: Int? = null,
    val attachedToMissionAtUtc: ZonedDateTime? = null,
    val detachedFromMissionAtUtc: ZonedDateTime? = null,
    val attachedEnvActionId: UUID? = null,
    val attachedMission: MissionDataOutput? = null,
    val attachedEnvAction: String? = null,
) {
    companion object {
        fun fromFullReportingDTO(
            objectMapper: ObjectMapper,
            reporting: FullReportingDTO,
        ): ReportingDataOutput {
            requireNotNull(reporting.id) { "ReportingEntity.id cannot be null" }
            return ReportingDataOutput(
                id = reporting.id,
                reportingId = reporting.reportingId,
                sourceType = reporting.sourceType,
                semaphoreId = reporting.semaphoreId,
                semaphore = if (reporting.semaphore != null) {
                    SemaphoreDataOutput.fromSemaphoreEntity(
                        reporting.semaphore,
                    )
                } else {
                    null
                },
                controlUnitId = reporting.controlUnitId,
                controlUnit =
                if (reporting.controlUnit != null) {
                    ControlUnitDataOutput
                        .fromFullControlUnit(
                            reporting.controlUnit,
                        )
                } else {
                    null
                },
                sourceName = reporting.sourceName,
                targetType = reporting.targetType,
                vehicleType = reporting.vehicleType,
                targetDetails = reporting.targetDetails,
                geom = reporting.geom,
                seaFront = reporting.seaFront,
                description = reporting.description,
                reportType = reporting.reportType,
                theme = reporting.theme,
                subThemes = reporting.subThemes,
                actionTaken = reporting.actionTaken,
                isControlRequired = reporting.isControlRequired,
                isUnitAvailable = reporting.isUnitAvailable,
                createdAt = reporting.createdAt,
                validityTime = reporting.validityTime,
                isArchived = reporting.isArchived,
                openBy = reporting.openBy,
                attachedMissionId = reporting.attachedMissionId,
                attachedToMissionAtUtc = reporting.attachedToMissionAtUtc,
                detachedFromMissionAtUtc = reporting.detachedFromMissionAtUtc,
                attachedEnvActionId = reporting.attachedEnvActionId,
                attachedMission = if (reporting.attachedMission != null) {
                    MissionDataOutput.fromMission(
                        reporting.attachedMission,
                    )
                } else {
                    null
                },
                attachedEnvAction = if (reporting.attachedEnvAction != null) {
                    EnvActionMapper.envActionEntityToJSON(
                        objectMapper,
                        reporting.attachedEnvAction,
                    )
                } else {
                    null
                },
            )
        }
        fun fromReporting(
            objectMapper: ObjectMapper,
            reporting: ReportingEntity,
            fullControlUnit: FullControlUnitDTO?,
            semaphore: SemaphoreEntity?,
            attachedMission: MissionEntity?,
            attachedEnvAction: EnvActionEntity?,
        ): ReportingDataOutput {
            requireNotNull(reporting.id) { "ReportingEntity.id cannot be null" }

            val semaphoreDataOutput =
                if (semaphore != null) {
                    SemaphoreDataOutput.fromSemaphoreEntity(semaphore)
                } else {
                    null
                }
            val controlUnitDataOutput =
                if (fullControlUnit != null) {
                    ControlUnitDataOutput.fromFullControlUnit(fullControlUnit)
                } else {
                    null
                }

            return ReportingDataOutput(
                id = reporting.id,
                reportingId = reporting.reportingId,
                sourceType = reporting.sourceType,
                semaphoreId = reporting.semaphoreId,
                semaphore = semaphoreDataOutput,
                controlUnitId = reporting.controlUnitId,
                controlUnit = controlUnitDataOutput,
                sourceName = reporting.sourceName,
                targetType = reporting.targetType,
                vehicleType = reporting.vehicleType,
                targetDetails = reporting.targetDetails,
                geom = reporting.geom,
                seaFront = reporting.seaFront,
                description = reporting.description,
                reportType = reporting.reportType,
                theme = reporting.theme,
                subThemes = reporting.subThemes,
                actionTaken = reporting.actionTaken,
                isControlRequired = reporting.isControlRequired,
                isUnitAvailable = reporting.isUnitAvailable,
                createdAt = reporting.createdAt,
                validityTime = reporting.validityTime,
                isArchived = reporting.isArchived,
                openBy = reporting.openBy,
                attachedMissionId = reporting.attachedMissionId,
                attachedToMissionAtUtc = reporting.attachedToMissionAtUtc,
                detachedFromMissionAtUtc = reporting.detachedFromMissionAtUtc,
                attachedEnvActionId = reporting.attachedEnvActionId,
                attachedMission = if (attachedMission != null) MissionDataOutput.fromMission(attachedMission) else null,
                attachedEnvAction = if (attachedEnvAction != null) {
                    EnvActionMapper.envActionEntityToJSON(
                        objectMapper,
                        attachedEnvAction,
                    )
                } else {
                    null
                },
            )
        }
    }
}
