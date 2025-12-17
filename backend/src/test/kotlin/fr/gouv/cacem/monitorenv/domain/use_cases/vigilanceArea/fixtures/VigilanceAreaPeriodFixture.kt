package fr.gouv.cacem.monitorenv.domain.use_cases.vigilanceArea.fixtures

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaPeriodEntity
import java.time.ZonedDateTime

class VigilanceAreaPeriodFixture {
    companion object {
        fun aVigilanceAreaPeriodEntity(
            startDate: ZonedDateTime? = ZonedDateTime.parse("2024-01-15T00:00:00Z"),
            endDate: ZonedDateTime? = ZonedDateTime.parse("2024-01-15T23:59:59Z"),
            frequency: FrequencyEnum? = FrequencyEnum.ALL_WEEKS,
            endingOccurenceDate: ZonedDateTime? = null,
            endCondition: EndingConditionEnum = EndingConditionEnum.OCCURENCES_NUMBER,
            endingOccurrencesNumber: Int? = 2,
            isAtAllTimes: Boolean = false,
        ): VigilanceAreaPeriodEntity =
            VigilanceAreaPeriodEntity(
                id = null,
                computedEndDate = ZonedDateTime.parse("2024-01-25T00:00:00Z"),
                endDatePeriod = endDate,
                endingCondition = endCondition,
                endingOccurrenceDate = endingOccurenceDate,
                endingOccurrencesNumber = endingOccurrencesNumber,
                frequency = frequency,
                startDatePeriod = startDate,
                isAtAllTimes = isAtAllTimes,
            )
    }
}
