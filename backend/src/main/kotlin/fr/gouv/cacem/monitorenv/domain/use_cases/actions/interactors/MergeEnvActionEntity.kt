package fr.gouv.cacem.monitorenv.domain.use_cases.actions.interactors

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.PatchableEnvActionEntity
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
        val patchedObservationsByUnit = getValueFromOptional(
            envActionEntity.observationsByUnit,
            patchableEnvActionEntity.observationsByUnit,
        )
        envActionEntity.actionEndDateTimeUtc = patchedActionEndDateTime
        envActionEntity.actionStartDateTimeUtc = patchedActionStartDateTime
        envActionEntity.observationsByUnit = patchedObservationsByUnit
        return envActionEntity
    }


    private fun <T> getValueFromOptional(existingValue: T?, optional: Optional<T>?): T? {
        return when {
            optional == null -> existingValue
            optional.isPresent -> optional.get()
            else -> null
        }
    }
}
