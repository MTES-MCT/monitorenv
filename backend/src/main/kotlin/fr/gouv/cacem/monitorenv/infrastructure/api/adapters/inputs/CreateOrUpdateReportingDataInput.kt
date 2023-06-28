package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.VehicleTypeEnum
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime

data class CreateOrUpdateReportingDataInput(
    val id: Int? = null,
    val sourceType: SourceTypeEnum? = null,
    val semaphore: ReportingSemaphoreDataInput? = null,
    val controlUnit: ControlUnitEntity? = null,
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
    fun toReportingEntity(): ReportingEntity {
        return ReportingEntity(
            id = this.id,
            sourceType = this.sourceType,
            semaphoreId = this.semaphore?.id,
            controlUnitId = this.controlUnit?.id,
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
            isInfractionProven = this.isInfractionProven,
            isControlRequired = this.isControlRequired,
            isUnitAvailable = this.isUnitAvailable,
            createdAt = this.createdAt,
            validityTime = this.validityTime,
            isDeleted = false,
        )
    }
}
