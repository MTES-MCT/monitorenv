package fr.gouv.cacem.monitorenv.infrastructure.rapportnav.adapters

import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import kotlinx.serialization.Serializable

@Serializable
data class RapportNavMissionActionDataOutput(
    val id: Int,
    val containsActionsAddedByUnit: Boolean,
) {
    companion object {
        fun fromRapportNavMissionActionEntity(
            rapportNavMissionActionEntity: RapportNavMissionActionEntity,
        ) =
            RapportNavMissionActionDataOutput(
                id = rapportNavMissionActionEntity.id,
                containsActionsAddedByUnit = rapportNavMissionActionEntity.containsActionsAddedByUnit,
            )
    }
}
