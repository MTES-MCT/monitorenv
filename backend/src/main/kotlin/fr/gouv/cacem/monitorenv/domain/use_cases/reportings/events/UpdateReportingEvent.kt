package fr.gouv.cacem.monitorenv.domain.use_cases.reportings.events

import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO

data class UpdateReportingEvent(
    val reporting: ReportingDetailsDTO,
)
