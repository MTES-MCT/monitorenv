package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs

import fr.gouv.cacem.monitorenv.domain.entities.missions.ActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionType
import java.time.ZonedDateTime
import java.time.ZoneOffset.UTC

data class CreateOrUpdateMissionDataInput(
    val id: Int,
    val missionType: MissionType,
    val missionStatus: String? = null,
    val facade: String? = null,
    val theme: String? = null,
    val observations: String? = null,
    val inputStartDatetimeUtc: ZonedDateTime? = null,
    val inputEndDatetimeUtc: ZonedDateTime? = null,
    val actions: List<ActionEntity>? = null,
) {
    fun toMissionEntity() :MissionEntity {
        return MissionEntity(
            id= this.id,
            missionType = this.missionType,
            missionStatus = this.missionStatus,
            facade = this.facade,
            theme = this.theme,
            observations = this.observations,
            inputStartDatetimeUtc = this.inputStartDatetimeUtc,
            inputEndDatetimeUtc = this.inputEndDatetimeUtc,
            actions = this.actions
        )
    }
}
