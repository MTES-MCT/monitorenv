package fr.gouv.cacem.monitorenv.domain.entities.missions

import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionSurveillanceEntity(
    override val id: UUID,
    override val actionStartDatetimeUtc: ZonedDateTime? = null,
    val actionTheme: String? = null,
    val actionSubTheme: String? = null,
    val protectedSpecies: List<String>? = listOf(),
    val duration: Double? = null,
    val observations: String? = null
) : EnvActionEntity(
    actionType = ActionTypeEnum.SURVEILLANCE,
    id = id
)
