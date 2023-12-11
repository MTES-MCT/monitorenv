package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import java.time.ZonedDateTime
import java.util.UUID

abstract class MissionEnvActionDataOutput(
    open val id: UUID,
    open val actionStartDateTimeUtc: ZonedDateTime? = null,
    open val actionType: ActionTypeEnum,
)
