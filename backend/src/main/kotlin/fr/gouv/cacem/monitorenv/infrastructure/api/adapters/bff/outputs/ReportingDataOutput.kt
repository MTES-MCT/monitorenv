package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime

data class ReportingDataOutput(
    val id: Int,
    val sourceType: SourceTypeEnum? = null,
    val semaphore: SemaphoreDataOutput? = null,
    val controlUnit: ControlUnitDataOutput? = null,
    val sourceName: String? = null,
    val targetType: TargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val targetDetails: TargetDetailsEntity? = null,
    val geom: Geometry? = null,
    val description: String? = null,
    val reportType: ReportingTypeEnum? = null,
    val theme: String? = null,
    val subThemes: List<String>? = listOf(),
    val actionTaken: String? = null,
    val isInfractionProven: Boolean? = null,
    val isControlRequired: Boolean? = null,
    val isUnitAvailable: Boolean? = null,
    val createdAt: ZonedDateTime,
    val validityTime: Int? = null,
) {
    companion object {
        fun fromReporting(reporting: ReportingEntity, controlUnit: ControlUnitEntity?, semaphore: SemaphoreEntity?): ReportingDataOutput {
            requireNotNull(reporting.id) {
                "ReportingEntity.id cannot be null"
            }
            return ReportingDataOutput(
                id = reporting.id,
                sourceType = reporting.sourceType,
                semaphore = if (semaphore != null) SemaphoreDataOutput.fromSemaphoreEntity(semaphore) else null,
                controlUnit = if (controlUnit != null) ControlUnitDataOutput.fromControlUnitEntity(controlUnit) else null,
                sourceName = reporting.sourceName,
                targetType = reporting.targetType,
                vehicleType = reporting.vehicleType,
                targetDetails = reporting.targetDetails,
                geom = reporting.geom,
                description = reporting.description,
                reportType = reporting.reportType,
                theme = reporting.theme,
                subThemes = reporting.subThemes,
                actionTaken = reporting.actionTaken,
                isInfractionProven = reporting.isInfractionProven,
                isControlRequired = reporting.isControlRequired,
                isUnitAvailable = reporting.isUnitAvailable,
                createdAt = reporting.createdAt,
                validityTime = reporting.validityTime,
            )
        }
    }
}
