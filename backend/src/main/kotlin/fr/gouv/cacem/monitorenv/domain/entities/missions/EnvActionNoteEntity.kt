package fr.gouv.cacem.monitorenv.domain.entities.missions

import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionNoteEntity(
    override val id: UUID,
    override val actionStartDatetimeUtc: ZonedDateTime? = null,
    val observations: String? = null
) : EnvActionEntity(
    actionType = ActionTypeEnum.NOTE,
    id = id
)
