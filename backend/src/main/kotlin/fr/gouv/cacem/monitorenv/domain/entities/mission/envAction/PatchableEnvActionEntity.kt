package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction

import java.time.ZonedDateTime
import java.util.Optional

data class PatchableEnvActionEntity(
    val actionStartDateTimeUtc: Optional<ZonedDateTime>?,
    val actionEndDateTimeUtc: Optional<ZonedDateTime>?,
    val observationsByUnit: Optional<String>?,
)
