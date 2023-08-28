package fr.gouv.cacem.monitorenv.domain.entities.mission

import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionNoteEntity(
    override val id: UUID,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    override val actionEndDateTimeUtc: ZonedDateTime? = null,
    val observations: String? = null,
) : EnvActionEntity(
    actionType = ActionTypeEnum.NOTE,
    id = id,
)
