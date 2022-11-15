package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs

import fr.gouv.cacem.monitorenv.domain.entities.missions.*

import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class CreateOrUpdateMissionDataInput(
  val id: Int? = null,
  val missionType: MissionTypeEnum,
  val missionStatus: MissionStatusEnum,
  val missionNature: List<MissionNatureEnum>? = listOf(),
  val resourceUnits: List<ResourceUnitEntity>? = listOf(),
  val openBy: String? = null,
  val closedBy: String? = null,
  val observations: String? = null,
  val facade: String? = null,
  val geom: MultiPolygon? = null,
  val inputStartDatetimeUtc: ZonedDateTime,
  val inputEndDatetimeUtc: ZonedDateTime? = null,
  val envActions: List<EnvActionEntity>? = null,
) {
    fun toMissionEntity() :MissionEntity {
      return MissionEntity(
        id= this.id,
        missionType = this.missionType,
        missionNature = this.missionNature,
        missionStatus = this.missionStatus,
        resourceUnits = this.resourceUnits,
        openBy = this.openBy,
        closedBy = this.closedBy,
        observations = this.observations,
        facade = this.facade,
        geom = this.geom,
        inputStartDatetimeUtc = this.inputStartDatetimeUtc,
        inputEndDatetimeUtc = this.inputEndDatetimeUtc,
        isDeleted = false,
        envActions = this.envActions
      )
    }
}
