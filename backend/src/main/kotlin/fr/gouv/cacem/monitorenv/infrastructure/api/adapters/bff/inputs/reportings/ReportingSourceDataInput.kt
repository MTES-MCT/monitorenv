package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingSourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import java.util.UUID

data class ReportingSourceDataInput(
    val id: UUID?,
    val reportingId: Int?,
    val sourceType: SourceTypeEnum,
    val semaphoreId: Int?,
    val controlUnitId: Int?,
    val sourceName: String?,
) {
    fun toReportingSourceEntity(): ReportingSourceEntity =
        ReportingSourceEntity(
            id = this.id,
            reportingId = this.reportingId,
            sourceType = this.sourceType,
            semaphoreId = this.semaphoreId,
            controlUnitId = this.controlUnitId,
            sourceName = this.sourceName,
        )
}
