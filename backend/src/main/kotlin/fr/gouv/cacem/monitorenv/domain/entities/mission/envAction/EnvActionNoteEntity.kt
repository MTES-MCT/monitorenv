package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import fr.gouv.cacem.monitorenv.domain.entities.Patchable
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionNoteEntity(
    override val id: UUID,
    @Patchable override var actionStartDateTimeUtc: ZonedDateTime? = null,
    override val completion: ActionCompletionEnum? = ActionCompletionEnum.COMPLETED,
    @Patchable override var observationsByUnit: String? = null,
    val observations: String? = null,
) : EnvActionEntity(
        id = id,
        actionType = ActionTypeEnum.NOTE,
        completion = completion,
        observationsByUnit = observationsByUnit,
    )
