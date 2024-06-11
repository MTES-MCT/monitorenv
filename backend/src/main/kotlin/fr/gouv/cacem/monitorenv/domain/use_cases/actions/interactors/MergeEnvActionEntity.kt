package fr.gouv.cacem.monitorenv.domain.use_cases.actions.interactors

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.PatchableEnvActionEntity
import java.time.ZonedDateTime
import java.util.Optional

@UseCase
class MergeEnvActionEntity {

    fun execute(
        envActionEntity: EnvActionEntity,
        patchableEnvActionEntity: PatchableEnvActionEntity,
    ): EnvActionEntity {
        val patchedActionEndDateTime =
            getValueFromOptional(
                envActionEntity.actionEndDateTimeUtc,
                patchableEnvActionEntity.actionEndDateTimeUtc,
            )
        val patchedActionStartDateTime = getValueFromOptional(
            envActionEntity.actionStartDateTimeUtc,
            patchableEnvActionEntity.actionStartDateTimeUtc,
        )
        envActionEntity.actionEndDateTimeUtc = patchedActionEndDateTime
        envActionEntity.actionStartDateTimeUtc = patchedActionStartDateTime
        return envActionEntity
    }

    private fun getValueFromOptional(
        actionEndDateTimeUtc: ZonedDateTime?,
        oActionEndDateTimeUtc: Optional<ZonedDateTime>?,
    ) = if (oActionEndDateTimeUtc == null) {
        actionEndDateTimeUtc
    } else if (oActionEndDateTimeUtc.isEmpty) {
        null
    } else {
        oActionEndDateTimeUtc.get()
    }
}
