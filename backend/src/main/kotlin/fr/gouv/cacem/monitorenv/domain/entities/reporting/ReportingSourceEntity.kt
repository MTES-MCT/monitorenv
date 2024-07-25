package fr.gouv.cacem.monitorenv.domain.entities.reporting

import java.util.UUID

data class ReportingSourceEntity(
    val id: UUID?,
    val reportingId: Int?,
    val sourceType: SourceTypeEnum,
    val semaphoreId: Int?,
    val controlUnitId: Int?,
    val sourceName: String?,
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
        }
    }
}
