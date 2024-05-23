package fr.gouv.cacem.monitorenv.domain.entities.reporting

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class ReportingEntity(
    val id: Int? = null,
    val reportingId: Long? = null,
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
    val themeId: Int? = null,
    val subThemeIds: List<Int>? = emptyList(),
    val actionTaken: String? = null,
    val isControlRequired: Boolean? = null,
    val hasNoUnitAvailable: Boolean? = null,
    val createdAt: ZonedDateTime,
    val validityTime: Int? = null,
    val isArchived: Boolean,
    val isDeleted: Boolean,
    val openBy: String? = null,
    val missionId: Int? = null,
    val attachedToMissionAtUtc: ZonedDateTime? = null,
    val detachedFromMissionAtUtc: ZonedDateTime? = null,
    val attachedEnvActionId: UUID? = null,
    val updatedAtUtc: ZonedDateTime? = null,
    val withVHFAnswer: Boolean? = null,
    val isInfractionProven: Boolean,
) {
    fun validate() {
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
