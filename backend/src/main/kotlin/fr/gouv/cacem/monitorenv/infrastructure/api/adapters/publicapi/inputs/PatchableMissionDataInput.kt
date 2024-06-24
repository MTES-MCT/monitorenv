package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs

import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import java.util.Optional

data class PatchableMissionDataInput(
    val observationsByUnit: Optional<String>?,
) {
    fun toPatchableMissionEntity(): PatchableMissionEntity {
        return PatchableMissionEntity(
            observationsByUnit = observationsByUnit,
        )
    }
}
