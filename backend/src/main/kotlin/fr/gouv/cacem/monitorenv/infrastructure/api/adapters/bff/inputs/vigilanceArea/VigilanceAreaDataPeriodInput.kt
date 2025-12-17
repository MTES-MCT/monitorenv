package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.vigilanceArea

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.EndingConditionEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.FrequencyEnum
import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.VigilanceAreaPeriodEntity
import java.time.ZonedDateTime
import java.util.UUID

data class VigilanceAreaDataPeriodInput(
    val id: UUID?,
    val computedEndDate: ZonedDateTime? = null,
    val endDatePeriod: ZonedDateTime? = null,
    val endingCondition: EndingConditionEnum? = null,
    val endingOccurrenceDate: ZonedDateTime? = null,
    val endingOccurrencesNumber: Int? = null,
    val frequency: FrequencyEnum? = null,
    val isAtAllTimes: Boolean,
    val startDatePeriod: ZonedDateTime? = null,
) {
    fun toVigilanceAreaPeriodEntity(): VigilanceAreaPeriodEntity =
        VigilanceAreaPeriodEntity(
            id = this.id,
            computedEndDate = this.computedEndDate,
            endDatePeriod = this.endDatePeriod,
            endingCondition = this.endingCondition,
            endingOccurrenceDate = this.endingOccurrenceDate,
            endingOccurrencesNumber = this.endingOccurrencesNumber,
            frequency = this.frequency,
            isAtAllTimes = this.isAtAllTimes,
            startDatePeriod = this.startDatePeriod,
        )
}
