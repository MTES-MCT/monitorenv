package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import java.time.ZonedDateTime

data class EditableBriefVigilanceAreaPeriodEntity(
    val endDatePeriod: ZonedDateTime?,
    val endingOccurenceDate: String,
    val frequency: String,
)
