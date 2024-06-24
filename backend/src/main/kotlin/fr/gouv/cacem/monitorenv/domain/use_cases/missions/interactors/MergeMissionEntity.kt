package fr.gouv.cacem.monitorenv.domain.use_cases.missions.interactors

import fr.gouv.cacem.monitorenv.config.UseCase
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.PatchableMissionEntity
import java.util.Optional

@UseCase
class MergeMissionEntity {

    fun execute(
        missionEntity: MissionEntity,
        patchableMissionEntity: PatchableMissionEntity,
    ): MissionEntity {
        val patchedObservationsByUnit =
            getValueFromOptional(missionEntity.observationsByUnit, patchableMissionEntity.observationsByUnit)
        missionEntity.observationsByUnit = patchedObservationsByUnit
        return missionEntity
    }

    private fun <T> getValueFromOptional(existingValue: T?, optional: Optional<T>?): T? {
        return when {
            optional == null -> existingValue
            optional.isPresent -> optional.get()
            else -> null
        }
    }
}
