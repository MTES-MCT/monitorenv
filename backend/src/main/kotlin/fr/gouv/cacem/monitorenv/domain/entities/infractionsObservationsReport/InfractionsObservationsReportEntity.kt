package fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.semaphores.SemaphoreEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime

data class InfractionsObservationsReportEntity(
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
    val isDeleted: Boolean,
)
