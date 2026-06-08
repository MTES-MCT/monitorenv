package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity

data class MissionTagInput(
    val id: Int?,
    val name: String,
    val isArchived: Boolean,
) {
    fun toMissionTagEntity(): MissionTagEntity =
        MissionTagEntity(
            id = id,
            name = name,
            isArchived = isArchived,
        )
}
