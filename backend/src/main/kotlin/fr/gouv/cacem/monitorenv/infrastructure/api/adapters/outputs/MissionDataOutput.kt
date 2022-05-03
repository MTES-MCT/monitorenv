package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.missions.ActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionType

import java.time.ZonedDateTime

data class MissionDataOutput(
    val id: Int ,
    val missionType: MissionType,
    val missionStatus: String? = null,
    val facade: String? = null,
    val theme: String? = null,
    val observations: String? = null,
    val inputStartDatetimeUtc: ZonedDateTime? = null,
    val inputEndDatetimeUtc: ZonedDateTime? = null,
    val actions: List<ActionEntity>? = null
) {
    companion object {
        fun fromMission(mission: MissionEntity) = MissionDataOutput(
            id = mission.id,
            missionType = mission.missionType,
            missionStatus = mission.missionStatus,
            facade = mission.facade,
            theme = mission.theme,
            observations= mission.observations,
            inputStartDatetimeUtc = mission.inputStartDatetimeUtc,
            inputEndDatetimeUtc = mission.inputEndDatetimeUtc,
            actions = mission.actions
        )
    }
}
