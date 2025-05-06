package fr.gouv.cacem.monitorenv.domain.entities.mission

import java.time.ZonedDateTime
import java.util.Optional

data class PatchableMissionEntity(
    val observationsByUnit: Optional<String>?,
    val startDateTimeUtc: ZonedDateTime?,
    val endDateTimeUtc: Optional<ZonedDateTime>?,
    val isUnderJdp: Boolean?,
)
