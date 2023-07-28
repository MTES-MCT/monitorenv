package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.ReportTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime

data class CreateOrUpdateInfractionsObservationsReportDataInput(
    val id: Int,
    val sourceType: SourceTypeEnum? = null,
    val semaphore: SemaphoreEntity? = null,
    val controlUnit: ControlUnitEntity? = null,
    val sourceName: String? = null,
    val targetType: TargetTypeEnum? = null,
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
    fun toInfractionsObservationsReportEntity(): InfractionsObservationsReportEntity {
        return InfractionsObservationsReportEntity(
            id = this.id,
            sourceType = this.sourceType,
            semaphore = this.semaphore,
            controlUnit = this.controlUnit,
            sourceName = this.sourceName,
            targetType = this.targetType,
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
