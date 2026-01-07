package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.Locale
import java.util.UUID

data class EditableBriefVigilanceAreaPeriodEntity(
    val id: UUID,
    val isAtAllTimes: Boolean,
    val startDatePeriod: ZonedDateTime? = null,
    val endDatePeriod: ZonedDateTime? = null,
    val endingOccurenceDate: String,
    val frequency: String,
) {
    fun getPeriodDate(): String {
        val formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy", Locale.FRENCH)
        return "Du ${startDatePeriod?.format(formatter)} au ${endDatePeriod?.format(formatter)}"
    }

    fun getPeriodText(): String = if (isAtAllTimes) "En tout temps" else getPeriodDate()
}
