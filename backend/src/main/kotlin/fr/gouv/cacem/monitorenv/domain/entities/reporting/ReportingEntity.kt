package fr.gouv.cacem.monitorenv.domain.entities.reporting

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime

data class ReportingEntity(
    val id: Int? = null,
    val reportingId: Int? = null,
    val sourceType: SourceTypeEnum? = null,
    val semaphoreId: Int? = null,
    val controlUnitId: Int? = null,
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
    val isInfractionProven: Boolean? = null,
    val isControlRequired: Boolean? = null,
    val isUnitAvailable: Boolean? = null,
    val createdAt: ZonedDateTime,
    val validityTime: Int? = null,
    val isArchived: Boolean,
    val isDeleted: Boolean,
) {
    fun checkValidity() {
        when (sourceType) {
            SourceTypeEnum.SEMAPHORE -> {
                require(semaphoreId != null && controlUnitId == null && sourceName == null) {
                    "SemaphoreId must be set and controlUnitId and sourceName must be null"
                }
            }
            SourceTypeEnum.CONTROL_UNIT -> {
                require(controlUnitId != null && semaphoreId == null && sourceName == null) {
                    "ControlUnitId must be set and semaphoreId and sourceName must be null"
                }
            }
            SourceTypeEnum.OTHER -> {
                require(sourceName != null && semaphoreId == null && controlUnitId == null) {
                    "SourceName must be set and semaphoreId and controlUnitId must be null"
                }
            }
            else -> {}
        }
    }
}
