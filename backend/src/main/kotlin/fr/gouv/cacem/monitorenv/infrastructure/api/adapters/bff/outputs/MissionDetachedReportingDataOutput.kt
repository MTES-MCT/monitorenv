package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import java.time.ZonedDateTime

data class MissionDetachedReportingDataOutput(
    val id: Int,
    val reportingId: Long,
    val attachedToMissionAtUtc: ZonedDateTime? = null,
    val detachedFromMissionAtUtc: ZonedDateTime? = null,
) {
    companion object {
        fun fromReporting(reporting: ReportingEntity): MissionDetachedReportingDataOutput {
            requireNotNull(reporting.id) { "an attached reporting must have an id" }
            requireNotNull(reporting.reportingId) {
                "an attached reporting must have a reportingId"
            }

            return MissionDetachedReportingDataOutput(
                id = reporting.id,
                reportingId = reporting.reportingId,
                attachedToMissionAtUtc = reporting.attachedToMissionAtUtc,
                detachedFromMissionAtUtc = reporting.detachedFromMissionAtUtc,
            )
        }
    }
}
