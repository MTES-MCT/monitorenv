package fr.gouv.cacem.monitorenv.domain.entities.regulatoryArea

import java.time.ZonedDateTime

data class AdditionalRefRegEntity(
    val id: String,
    val endDate: ZonedDateTime? = null,
    val refReg: String? = null,
    val startDate: ZonedDateTime? = null,
)
