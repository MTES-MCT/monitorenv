package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs

import fr.gouv.cacem.monitorenv.domain.entities.missions.ActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class CreateOrUpdateMissionDataInput(
  val id: Int? = null,
  val missionType: MissionTypeEnum,
  val administration: String? = null,
  val unit: String? = null,
  val resources : List<String>? = listOf(),
  val missionStatus: String? = null,
  val open_by: String? = null,
  val closed_by: String? = null,
  val observations: String? = null,
  val facade: String? = null,
  val theme: String? = null,
  val geom: MultiPolygon? = null,
  val inputStartDatetimeUtc: ZonedDateTime? = null,
  val inputEndDatetimeUtc: ZonedDateTime? = null,
  val actions: List<ActionEntity>? = null,
) {
    fun toMissionEntity() :MissionEntity {
      return MissionEntity(
        id= this.id,
        missionType = this.missionType,
        administration = this.administration,
        unit = this.unit,
        resources = this.resources,
        missionStatus = this.missionStatus,
        open_by = this.open_by,
        closed_by = this.closed_by,
        observations = this.observations,
        facade = this.facade,
        theme = this.theme,
        geom = this.geom,
        inputStartDatetimeUtc = this.inputStartDatetimeUtc,
        inputEndDatetimeUtc = this.inputEndDatetimeUtc,
        actions = this.actions
      )
    }
}
