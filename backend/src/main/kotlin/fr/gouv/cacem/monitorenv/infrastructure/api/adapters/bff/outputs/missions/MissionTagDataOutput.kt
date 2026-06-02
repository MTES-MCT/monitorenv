package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTagEntity

data class MissionTagDataOutput(
    val id: Int?,
    val isArchived: Boolean,
    val name: String,
) {
    companion object {
        fun fromMissionTagEntity(missionTagEntity: MissionTagEntity): MissionTagDataOutput =
            MissionTagDataOutput(
                id = missionTagEntity.id,
                isArchived = missionTagEntity.isArchived,
                name = missionTagEntity.name,
            )
    }
}
