package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaPeriodEntity
import java.time.ZonedDateTime
import java.util.UUID

data class VigilanceAreaPeriodDataOutput(
    val id: UUID?,
    val computedEndDate: ZonedDateTime?,
    val endDatePeriod: ZonedDateTime?,
    val endingCondition: EndingConditionEnum?,
    val endingOccurrenceDate: ZonedDateTime?,
    val endingOccurrencesNumber: Int?,
    val frequency: FrequencyEnum?,
    val isAtAllTimes: Boolean,
    val startDatePeriod: ZonedDateTime?,
) {
    companion object {
        fun fromVigilanceAreaPeriod(vigilanceArea: VigilanceAreaPeriodEntity): VigilanceAreaPeriodDataOutput =
            VigilanceAreaPeriodDataOutput(
                id = vigilanceArea.id,
                computedEndDate = vigilanceArea.computedEndDate,
                endDatePeriod = vigilanceArea.endDatePeriod,
                endingCondition = vigilanceArea.endingCondition,
                endingOccurrenceDate = vigilanceArea.endingOccurrenceDate,
                endingOccurrencesNumber = vigilanceArea.endingOccurrencesNumber,
                frequency = vigilanceArea.frequency,
                isAtAllTimes = vigilanceArea.isAtAllTimes,
                startDatePeriod = vigilanceArea.startDatePeriod,
            )
    }
}
