package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import java.time.ZonedDateTime
import java.util.Optional

data class PatchableMissionDataInput(
    val observationsByUnit: Optional<String>?,
    val startDateTimeUtc: ZonedDateTime?,
    val endDateTimeUtc: Optional<ZonedDateTime>?,
    val missionTypes:  List<MissionTypeEnum>?,
) {
    fun toPatchableMissionEntity(): PatchableMissionEntity {
        return PatchableMissionEntity(
            observationsByUnit = observationsByUnit,
            startDateTimeUtc = startDateTimeUtc,
            endDateTimeUtc = endDateTimeUtc,
            missionTypes = missionTypes
        )
    }
}
