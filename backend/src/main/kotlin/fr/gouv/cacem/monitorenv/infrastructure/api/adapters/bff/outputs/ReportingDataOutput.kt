package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.controlResource.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphore.SemaphoreEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime

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
) {
    companion object {
        fun fromReporting(
            reporting: ReportingEntity,
            controlUnit: ControlUnitEntity?,
            semaphore: SemaphoreEntity?,
        ): ReportingDataOutput {
            requireNotNull(reporting.id) { "ReportingEntity.id cannot be null" }
            return ReportingDataOutput(
                id = reporting.id,
                reportingId = reporting.reportingId,
                sourceType = reporting.sourceType,
                semaphoreId = reporting.semaphoreId,
                semaphore =
                if (semaphore != null) {
                    SemaphoreDataOutput
                        .fromSemaphoreEntity(
                            semaphore,
                        )
                } else {
                    null
                },
                controlUnitId = reporting.controlUnitId,
                controlUnit =
                if (controlUnit != null) {
                    ControlUnitDataOutput
                        .fromControlUnitEntity(
                            controlUnit,
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
            )
        }
    }
}
