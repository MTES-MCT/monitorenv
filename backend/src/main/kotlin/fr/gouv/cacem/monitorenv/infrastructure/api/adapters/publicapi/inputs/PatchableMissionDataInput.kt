package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import java.time.ZonedDateTime
import java.util.Optional

data class PatchableMissionDataInput(
    val observationsByUnit: Optional<String>?,
    val startDateTimeUtc: ZonedDateTime?,
    val endDateTimeUtc: Optional<ZonedDateTime>?,
    val isUnderJdp: Boolean?,
) {
    fun toPatchableMissionEntity(): PatchableMissionEntity =
        PatchableMissionEntity(
            observationsByUnit = observationsByUnit,
            startDateTimeUtc = startDateTimeUtc,
            endDateTimeUtc = endDateTimeUtc,
            isUnderJdp = isUnderJdp,
        )
}
