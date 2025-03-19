package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingSourceDTO
import java.util.*

data class ReportingSourceDataOutput(
    val id: UUID?,
    val reportingId: Int?,
    val sourceType: SourceTypeEnum,
    val semaphoreId: Int?,
    val controlUnitId: Int?,
    val sourceName: String?,
    val displayedSource: String,
) {
    companion object {
        fun fromReportingSourceDTO(reportingSourceDTO: ReportingSourceDTO): ReportingSourceDataOutput =
            ReportingSourceDataOutput(
                id = reportingSourceDTO.reportingSource.id,
                reportingId = reportingSourceDTO.reportingSource.reportingId,
                sourceType = reportingSourceDTO.reportingSource.sourceType,
                controlUnitId = reportingSourceDTO.controlUnit?.id,
                semaphoreId = reportingSourceDTO.semaphore?.id,
                sourceName = reportingSourceDTO.reportingSource.sourceName,
                displayedSource =
                    when (reportingSourceDTO.reportingSource.sourceType) {
                        SourceTypeEnum.SEMAPHORE ->
                            reportingSourceDTO.semaphore?.unit
                                ?: reportingSourceDTO.semaphore?.name

                        SourceTypeEnum.CONTROL_UNIT -> reportingSourceDTO.controlUnit?.name
                        SourceTypeEnum.OTHER -> reportingSourceDTO.reportingSource.sourceName
                    } ?: "",
            )
    }
}
