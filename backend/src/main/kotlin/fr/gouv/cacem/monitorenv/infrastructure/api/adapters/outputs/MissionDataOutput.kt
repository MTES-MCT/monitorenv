package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import org.locationtech.jts.geom.MultiPolygon

import java.time.ZonedDateTime

data class MissionDataOutput(
    val id: Int,
    val missionType: MissionTypeEnum,
    val missionNature: List<MissionNatureEnum>? = null,
    val resourceUnits: List<ResourceUnitEntity>? = null,
    val missionStatus: MissionStatusEnum,
    val open_by: String? = null,
    val closed_by: String? = null,
    val observations: String? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val inputStartDatetimeUtc: ZonedDateTime,
    val inputEndDatetimeUtc: ZonedDateTime? = null,
    val envActions: List<EnvActionEntity>? = null
) {
    companion object {
        fun fromMission(mission: MissionEntity): MissionDataOutput {
            requireNotNull(mission.id) {
                "a mission must have an id"
            }
            return MissionDataOutput(
                id = mission.id,
                missionType = mission.missionType,
                missionNature = mission.missionNature,
                resourceUnits = mission.resourceUnits,
                missionStatus = mission.missionStatus,
                open_by = mission.open_by,
                closed_by = mission.closed_by,
                observations= mission.observations,
                facade = mission.facade,
                geom = mission.geom,
                inputStartDatetimeUtc = mission.inputStartDatetimeUtc,
                inputEndDatetimeUtc = mission.inputEndDatetimeUtc,
                envActions = mission.envActions
            )
        }
    }
}
