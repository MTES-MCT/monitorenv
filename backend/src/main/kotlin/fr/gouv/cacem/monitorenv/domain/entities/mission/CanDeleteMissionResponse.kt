package fr.gouv.cacem.monitorenv.domain.entities.mission

data class CanDeleteMissionResponse(
    val canDelete: Boolean,
    val sources: List<MissionSourceEnum>? = listOf(),
)
