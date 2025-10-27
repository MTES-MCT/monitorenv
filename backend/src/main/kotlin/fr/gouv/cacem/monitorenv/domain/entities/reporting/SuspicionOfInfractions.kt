package fr.gouv.cacem.monitorenv.domain.entities.reporting

import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingSourceDTO
import java.time.ZonedDateTime

data class SuspicionOfInfractions(
    val id: Int? = null,
    val reportingId: Long? = null,
    val reportingSources: List<ReportingSourceDTO>,
    val targetType: TargetTypeEnum? = null,
    val reportType: ReportingTypeEnum? = null,
    val createdAt: ZonedDateTime,
    val tags: List<TagEntity>,
    var theme: ThemeEntity,
)
