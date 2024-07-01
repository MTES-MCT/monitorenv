package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.PatchableEnvActionEntity
import java.time.ZonedDateTime
import java.util.Optional

data class PatchableEnvActionDataInput(
    val actionStartDateTimeUtc: Optional<ZonedDateTime>?,
    val actionEndDateTimeUtc: Optional<ZonedDateTime>?,
) {
    fun toPatchableEnvActionEntity(): PatchableEnvActionEntity {
        return PatchableEnvActionEntity(
            actionStartDateTimeUtc = actionStartDateTimeUtc,
            actionEndDateTimeUtc = actionEndDateTimeUtc,
        )
    }
}
