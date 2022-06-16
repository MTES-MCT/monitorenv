package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.missions.ActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum

import java.time.ZonedDateTime

data class MissionDataOutput(
    val id: Int? = null,
    val missionType: MissionTypeEnum,
    val unit: String? = null,
    val administration: String? = null,
    val missionStatus: String? = null,
    val author: String? = null,
    val observations: String? = null,
    val facade: String? = null,
    val theme: String? = null,
    val inputStartDatetimeUtc: ZonedDateTime? = null,
    val inputEndDatetimeUtc: ZonedDateTime? = null,
    val actions: List<ActionEntity>? = null
) {
    companion object {
        fun fromMission(mission: MissionEntity): MissionDataOutput {
            requireNotNull(mission.id) {
                "a mission must have an id"
            }
            return MissionDataOutput(
                id = mission.id,
                missionType = mission.missionType,
                unit = mission.unit,
                administration = mission.administration,
                missionStatus = mission.missionStatus,
                author = mission.author,
                observations= mission.observations,
                facade = mission.facade,
                theme = mission.theme,
                inputStartDatetimeUtc = mission.inputStartDatetimeUtc,
                inputEndDatetimeUtc = mission.inputEndDatetimeUtc,
                actions = mission.actions
            )
        }
    }
}
