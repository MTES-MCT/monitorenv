package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SuspicionOfInfractions
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.reportings.ReportingSourceDataOutput.Companion.fromReportingSourceDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.tags.TagOutput.Companion.fromTagEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.themes.ThemeOutput.Companion.fromThemeEntity
import java.time.ZonedDateTime

data class ReportingHistoryOfInfractionDataOutput(
    val createdAt: ZonedDateTime,
    val id: Int,
    val reportingId: Long? = null,
    val reportingSources: List<ReportingSourceDataOutput>,
    val reportType: ReportingTypeEnum? = null,
    val theme: ThemeOutput,
    val tags: List<TagOutput>,
) {
    companion object {
        fun fromReportingHistoryOfInfraction(
            reporting: SuspicionOfInfractions,
        ): ReportingHistoryOfInfractionDataOutput {
            requireNotNull(reporting.id) { "ReportingEntity.id cannot be null" }
            return ReportingHistoryOfInfractionDataOutput(
                id = reporting.id,
                reportingId = reporting.reportingId,
                reportingSources = reporting.reportingSources.map { fromReportingSourceDTO(it) },
                reportType = reporting.reportType,
                createdAt = reporting.createdAt,
                tags = reporting.tags.map { fromTagEntity(it) },
                theme = fromThemeEntity(reporting.theme),
            )
        }
    }
}
