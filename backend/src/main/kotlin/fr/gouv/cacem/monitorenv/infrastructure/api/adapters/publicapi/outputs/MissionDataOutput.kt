package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class MissionDataOutput(
    val id: Int,
    val missionTypes: List<MissionTypeEnum>,
    val controlUnits: List<LegacyControlUnitEntity>? = listOf(),
    val openBy: String? = null,
    val closedBy: String? = null,
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val startDateTimeUtc: ZonedDateTime,
    val endDateTimeUtc: ZonedDateTime? = null,
    val envActions: List<EnvActionEntity>? = null,
    val missionSource: MissionSourceEnum,
    val isClosed: Boolean,
    val hasMissionOrder: Boolean,
    val isUnderJdp: Boolean,
    val isGeometryComputedFromControls: Boolean,
) {
    companion object {
        fun fromMissionDTO(dto: MissionDTO): MissionDataOutput {
            requireNotNull(dto.mission.id) {
                "a mission must have an id"
            }

            return MissionDataOutput(
                id = dto.mission.id,
                missionTypes = dto.mission.missionTypes,
                controlUnits = dto.mission.controlUnits,
                openBy = dto.mission.openBy,
                closedBy = dto.mission.closedBy,
                observationsCacem = dto.mission.observationsCacem,
                observationsCnsp = dto.mission.observationsCnsp,
                facade = dto.mission.facade,
                geom = dto.mission.geom,
                startDateTimeUtc = dto.mission.startDateTimeUtc,
                endDateTimeUtc = dto.mission.endDateTimeUtc,
                envActions = dto.mission.envActions,
                missionSource = dto.mission.missionSource,
                isClosed = dto.mission.isClosed,
                hasMissionOrder = dto.mission.hasMissionOrder,
                isUnderJdp = dto.mission.isUnderJdp,
                isGeometryComputedFromControls = dto.mission.isGeometryComputedFromControls,
            )
        }

        fun fromMissionEntity(mission: MissionEntity): MissionDataOutput {
            requireNotNull(mission.id) {
                "a mission must have an id"
            }

            return MissionDataOutput(
                id = mission.id,
                missionTypes = mission.missionTypes,
                controlUnits = mission.controlUnits,
                openBy = mission.openBy,
                closedBy = mission.closedBy,
                observationsCacem = mission.observationsCacem,
                observationsCnsp = mission.observationsCnsp,
                facade = mission.facade,
                geom = mission.geom,
                startDateTimeUtc = mission.startDateTimeUtc,
                endDateTimeUtc = mission.endDateTimeUtc,
                envActions = mission.envActions,
                missionSource = mission.missionSource,
                isClosed = mission.isClosed,
                hasMissionOrder = mission.hasMissionOrder,
                isUnderJdp = mission.isUnderJdp,
                isGeometryComputedFromControls = mission.isGeometryComputedFromControls,
            )
        }
    }
}
