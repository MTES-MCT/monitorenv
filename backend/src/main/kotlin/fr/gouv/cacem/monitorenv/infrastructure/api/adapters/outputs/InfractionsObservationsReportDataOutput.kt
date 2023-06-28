package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.ReportTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.TargetDetailsEntity
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime

data class InfractionsObservationsReportDataOutput(
    val id: Int,
    val sourceType: SourceTypeEnum? = null,
    val semaphore: SemaphoreEntity? = null,
    val controlUnit: ControlUnitEntity? = null,
    val sourceName: String? = null,
    val targetType: TargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val targetDetails: TargetDetailsEntity? = null,
    val geom: Geometry? = null,
    val description: String? = null,
    val reportType: ReportTypeEnum? = null,
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
        fun fromInfractionsObservationsReportEntity(entity: InfractionsObservationsReportEntity): InfractionsObservationsReportDataOutput {
            requireNotNull(entity.id) {
                "InfractionsObservationsReportEntity.id cannot be null"
            }
            return InfractionsObservationsReportDataOutput(
                id = entity.id,
                sourceType = entity.sourceType,
                semaphore = entity.semaphore,
                controlUnit = entity.controlUnit,
                sourceName = entity.sourceName,
                targetType = entity.targetType,
                vehicleType = entity.vehicleType,
                targetDetails = entity.targetDetails,
                geom = entity.geom,
                description = entity.description,
                reportType = entity.reportType,
                theme = entity.theme,
                subThemes = entity.subThemes,
                actionTaken = entity.actionTaken,
                isInfractionProven = entity.isInfractionProven,
                isControlRequired = entity.isControlRequired,
                isUnitAvailable = entity.isUnitAvailable,
                createdAt = entity.createdAt,
                validityTime = entity.validityTime,
            )
        }
    }
}
