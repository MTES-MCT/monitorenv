package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import java.time.ZonedDateTime
import java.util.Optional

data class PatchableMissionDataInput(
    val observationsByUnit: Optional<String>?,
    val startDateTimeUtc: ZonedDateTime?,
    val endDateTimeUtc: Optional<ZonedDateTime>?,
) {
    fun toPatchableMissionEntity(): PatchableMissionEntity {
        return PatchableMissionEntity(
            observationsByUnit = observationsByUnit,
            startDateTimeUtc = startDateTimeUtc,
            endDateTimeUtc = endDateTimeUtc,
        )
    }
}
