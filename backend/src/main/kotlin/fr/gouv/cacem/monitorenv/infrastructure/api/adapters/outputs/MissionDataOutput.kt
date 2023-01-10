package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlResourceEntity
import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class MissionDataOutput(
    val id: Int,
    val missionType: MissionTypeEnum,
    val missionNature: List<MissionNatureEnum>? = null,
    val controlUnits: List<ControlUnitEntity>? = listOf(),
    val controlResources: List<ControlResourceEntity> = listOf(),
    val openBy: String? = null,
    val closedBy: String? = null,
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val inputStartDateTimeUtc: ZonedDateTime,
    val inputEndDateTimeUtc: ZonedDateTime? = null,
    val envActions: List<EnvActionEntity>? = null,
    val missionSource: MissionSourceEnum,
    val isClosed: Boolean
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
                controlUnits = mission.controlUnits,
                controlResources = mission.controlResources,
                openBy = mission.openBy,
                closedBy = mission.closedBy,
                observationsCacem = mission.observationsCacem,
                observationsCnsp = mission.observationsCnsp,
                facade = mission.facade,
                geom = mission.geom,
                inputStartDateTimeUtc = mission.inputStartDateTimeUtc,
                inputEndDateTimeUtc = mission.inputEndDateTimeUtc,
                envActions = mission.envActions,
                missionSource = mission.missionSource,
                isClosed = mission.isClosed
            )
        }
    }
}
