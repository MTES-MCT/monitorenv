package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingSourceDTO
import java.util.UUID

data class ReportingSourceDataOutput(
    val id: UUID?,
    val reportingId: Int?,
    val sourceType: SourceTypeEnum,
    val semaphoreId: Int?,
    val controlUnitId: Int?,
//    val semaphore: SemaphoreDataOutput?,
//    val controlUnit: ControlUnitDataOutput?,
    val sourceName: String?,
    val displayedSource: String,
) {
    companion object {
        fun fromReportingSourceDTO(
            reportingSourceDTO: ReportingSourceDTO,
        ): ReportingSourceDataOutput {
            return ReportingSourceDataOutput(
                id = reportingSourceDTO.reportingSource.id,
                reportingId = reportingSourceDTO.reportingSource.reportingId,
                sourceType = reportingSourceDTO.reportingSource.sourceType,
                controlUnitId = reportingSourceDTO.controlUnit?.controlUnit?.id,
                semaphoreId = reportingSourceDTO.semaphore?.id,
//                semaphore = reportingSourceDTO.semaphore?.let { SemaphoreDataOutput.fromSemaphoreEntity(it) },
//                controlUnit = reportingSourceDTO.controlUnit?.let { ControlUnitDataOutput.fromFullControlUnit(it) },
                sourceName = reportingSourceDTO.reportingSource.sourceName,
                displayedSource =
                when (reportingSourceDTO.reportingSource.sourceType) {
                    SourceTypeEnum.SEMAPHORE -> reportingSourceDTO.semaphore?.unit ?: reportingSourceDTO.semaphore?.name
                    SourceTypeEnum.CONTROL_UNIT -> reportingSourceDTO.controlUnit?.controlUnit?.name
                    SourceTypeEnum.OTHER -> reportingSourceDTO.reportingSource.sourceName
                } ?: "",
            )
        }
    }
}
