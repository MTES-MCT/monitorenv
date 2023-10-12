package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import java.time.ZonedDateTime

data class MissionDetachedReportingDataOutput(
    val id: Int,
    val reportingId: Long,
    val attachedToMissionAtUtc: ZonedDateTime? = null,
    val detachedFromMissionAtUtc: ZonedDateTime? = null,
) {
    companion object {
        fun fromReportingDTO(dto: ReportingDTO): MissionDetachedReportingDataOutput {
            requireNotNull(dto.reporting.id) {
                "an attached reporting must have an id"
            }
            requireNotNull(dto.reporting.reportingId) {
                "an attached reporting must have a reportingId"
            }

            return MissionDetachedReportingDataOutput(
                id = dto.reporting.id,
                reportingId = dto.reporting.reportingId,
                attachedToMissionAtUtc = dto.reporting.attachedToMissionAtUtc,
                detachedFromMissionAtUtc = dto.reporting.detachedFromMissionAtUtc,
            )
        }
    }
}
