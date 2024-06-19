package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import java.time.ZonedDateTime
import java.util.*

data class EnvActionNoteEntity(
    override val id: UUID,
    override var actionStartDateTimeUtc: ZonedDateTime? = null,
    override val missionId: Int? = null,
    override var observationsByUnit: String? = null,
    val observations: String? = null,
) :
    EnvActionEntity(
        actionType = ActionTypeEnum.NOTE,
        id = id,
        missionId = missionId,
        observationsByUnit = observationsByUnit,
    )
