package fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav

import kotlinx.serialization.Serializable

@Serializable
data class RapportNavMissionActionEntity(
    val id: Int,
    val containsActionsAddedByUnit: Boolean,
)
