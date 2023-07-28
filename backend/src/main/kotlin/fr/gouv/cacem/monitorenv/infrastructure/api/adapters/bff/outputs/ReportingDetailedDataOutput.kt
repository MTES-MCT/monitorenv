package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime

data class ReportingDetailedDataOutput(
    val id: Int,
    val reportingId: Int? = null,
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
    val theme: String? = null,
    val subThemes: List<String>? = listOf(),
    val actionTaken: String? = null,
    val isInfractionProven: Boolean? = null,
    val isControlRequired: Boolean? = null,
    val isUnitAvailable: Boolean? = null,
    val createdAt: ZonedDateTime,
    val validityTime: Int? = null,
    val isArchived: Boolean,
) {
    companion object {
        fun fromReporting(reporting: ReportingEntity, controlUnit: ControlUnitEntity?, semaphore: SemaphoreEntity?): ReportingDetailedDataOutput {
            requireNotNull(reporting.id) {
                "ReportingEntity.id cannot be null"
            }
            return ReportingDetailedDataOutput(
                id = reporting.id,
                reportingId = reporting.reportingId,
                sourceType = reporting.sourceType,
                semaphoreId = reporting.semaphoreId,
                controlUnitId = reporting.controlUnitId,
                sourceName = reporting.sourceName,
                displayedSource = when (reporting.sourceType) {
                    SourceTypeEnum.SEMAPHORE -> semaphore?.name
                    SourceTypeEnum.CONTROL_UNIT -> controlUnit?.name
                    SourceTypeEnum.OTHER -> reporting.sourceName
                    else -> ""
                },
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
                isInfractionProven = reporting.isInfractionProven,
                isControlRequired = reporting.isControlRequired,
                isUnitAvailable = reporting.isUnitAvailable,
                createdAt = reporting.createdAt,
                validityTime = reporting.validityTime,
                isArchived = reporting.isArchived,
            )
        }
    }
}
