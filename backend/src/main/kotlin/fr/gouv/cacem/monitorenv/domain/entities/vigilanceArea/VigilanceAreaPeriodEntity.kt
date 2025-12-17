package fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea

import java.time.ZonedDateTime
import java.util.UUID

data class VigilanceAreaPeriodEntity(
    val id: UUID?,
    val computedEndDate: ZonedDateTime?,
    val endDatePeriod: ZonedDateTime?,
    val endingCondition: EndingConditionEnum?,
    val endingOccurrenceDate: ZonedDateTime?,
    val endingOccurrencesNumber: Int?,
    val frequency: FrequencyEnum?,
    val isAtAllTimes: Boolean,
    val startDatePeriod: ZonedDateTime?,
)
