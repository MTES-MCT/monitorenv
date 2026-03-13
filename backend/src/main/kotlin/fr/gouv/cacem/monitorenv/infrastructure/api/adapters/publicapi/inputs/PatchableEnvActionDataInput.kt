package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.PatchableEnvActionEntity
import java.time.ZonedDateTime
import java.util.Optional

data class PatchableEnvActionDataInput(
    val actionStartDateTimeUtc: Optional<ZonedDateTime>?,
    val actionEndDateTimeUtc: Optional<ZonedDateTime>?,
    val observationsByUnit: Optional<String>?,
    val hasDivingDuringOperation: Optional<Boolean>?,
    val incidentDuringOperation: Optional<Boolean>?,
) {
    fun toPatchableEnvActionEntity(): PatchableEnvActionEntity =
        PatchableEnvActionEntity(
            actionStartDateTimeUtc = actionStartDateTimeUtc,
            actionEndDateTimeUtc = actionEndDateTimeUtc,
            observationsByUnit = observationsByUnit,
            hasDivingDuringOperation = hasDivingDuringOperation,
            incidentDuringOperation = incidentDuringOperation,
        )
}
