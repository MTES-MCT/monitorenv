package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionControlWithInfractionsEntity(
    val id: UUID,
    val actionType: ActionTypeEnum = ActionTypeEnum.CONTROL,
    val actionStartDateTimeUtc: ZonedDateTime? = null,
    val missionId: Int? = null,
    val infractions: List<InfractionEntity>?,
    val themes: List<String>?,
    val controlUnits: List<String>,
)
