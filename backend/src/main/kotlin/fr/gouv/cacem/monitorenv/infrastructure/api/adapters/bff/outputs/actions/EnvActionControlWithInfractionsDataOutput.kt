package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlWithInfractionsEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionControlWithInfractionsDataOutput(
    val actionStartDateTimeUtc: ZonedDateTime? = null,
    val actionType: ActionTypeEnum = ActionTypeEnum.CONTROL,
    val controlUnits: List<String>? = listOf(),
    val id: UUID?,
    val infractions: List<InfractionEntity>? = listOf(),
    val missionId: Int? = null,
    val themes: List<String>? = listOf(),
) {
    companion object {
        fun fromEnvActionControlWithInfractionsEntity(
            envActionControlWithInfractionsEntity: EnvActionControlWithInfractionsEntity,
        ) = EnvActionControlWithInfractionsDataOutput(
            id = envActionControlWithInfractionsEntity.id,
            actionStartDateTimeUtc = envActionControlWithInfractionsEntity.actionStartDateTimeUtc,
            missionId = envActionControlWithInfractionsEntity.missionId,
            infractions = envActionControlWithInfractionsEntity.infractions,
            themes = envActionControlWithInfractionsEntity.themes,
            controlUnits = envActionControlWithInfractionsEntity.controlUnits,
        )
    }
}
