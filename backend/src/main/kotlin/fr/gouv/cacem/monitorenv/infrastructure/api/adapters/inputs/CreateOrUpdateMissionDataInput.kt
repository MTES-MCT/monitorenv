package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs

import fr.gouv.cacem.monitorenv.domain.entities.missions.ActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum
import java.time.ZonedDateTime

data class CreateOrUpdateMissionDataInput(
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
  val actions: List<ActionEntity>? = null,
) {
    fun toMissionEntity() :MissionEntity {
      return MissionEntity(
        id= this.id,
        missionType = this.missionType,
        unit = this.unit,
        administration = this.administration,
        missionStatus = this.missionStatus,
        author = this.author,
        observations = this.observations,
        facade = this.facade,
        theme = this.theme,
        inputStartDatetimeUtc = this.inputStartDatetimeUtc,
        inputEndDatetimeUtc = this.inputEndDatetimeUtc,
        actions = this.actions
      )
    }
}
