package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.rapportnav.RapportNavMissionActionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class MissionDataOutput(
    val id: Int,
    val missionTypes: List<MissionTypeEnum>,
    val controlUnits: List<LegacyControlUnitEntity>? = listOf(),
    val openBy: String? = null,
    val completedBy: String? = null,
    val observationsByUnit: String? = null,
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val startDateTimeUtc: ZonedDateTime,
    val endDateTimeUtc: ZonedDateTime? = null,
    val createdAtUtc: ZonedDateTime? = null,
    val updatedAtUtc: ZonedDateTime? = null,
    val envActions: List<MissionEnvActionDataOutput>? = null,
    val missionSource: MissionSourceEnum,
    val hasMissionOrder: Boolean,
    val isUnderJdp: Boolean,
    val isGeometryComputedFromControls: Boolean,
    val hasRapportNavActions: RapportNavMissionActionEntity? = null,
) {
    companion object {
        fun fromMissionEntity(mission: MissionEntity): MissionDataOutput {
            requireNotNull(mission.id) { "a mission must have an id" }

            return MissionDataOutput(
                id = mission.id,
                missionTypes = mission.missionTypes,
                controlUnits = mission.controlUnits,
                openBy = mission.openBy,
                completedBy = mission.completedBy,
                observationsCacem = mission.observationsCacem,
                observationsCnsp = mission.observationsCnsp,
                facade = mission.facade,
                geom = mission.geom,
                startDateTimeUtc = mission.startDateTimeUtc,
                endDateTimeUtc = mission.endDateTimeUtc,
                createdAtUtc = mission.createdAtUtc,
                updatedAtUtc = mission.updatedAtUtc,
                envActions =
                mission.envActions?.map {
                    MissionEnvActionDataOutput.fromEnvActionEntity(
                        envActionEntity = it,
                    )
                },
                missionSource = mission.missionSource,
                hasMissionOrder = mission.hasMissionOrder,
                isUnderJdp = mission.isUnderJdp,
                isGeometryComputedFromControls = mission.isGeometryComputedFromControls,
            )
        }

        fun fromMissionDTO(missionDto: MissionDTO): MissionDataOutput {
            requireNotNull(missionDto.mission.id) { "a mission must have an id" }

            return MissionDataOutput(
                id = missionDto.mission.id,
                missionTypes = missionDto.mission.missionTypes,
                controlUnits = missionDto.mission.controlUnits,
                openBy = missionDto.mission.openBy,
                completedBy = missionDto.mission.completedBy,
                observationsByUnit = missionDto.mission.observationsByUnit,
                observationsCacem = missionDto.mission.observationsCacem,
                observationsCnsp = missionDto.mission.observationsCnsp,
                facade = missionDto.mission.facade,
                geom = missionDto.mission.geom,
                startDateTimeUtc = missionDto.mission.startDateTimeUtc,
                endDateTimeUtc = missionDto.mission.endDateTimeUtc,
                createdAtUtc = missionDto.mission.createdAtUtc,
                updatedAtUtc = missionDto.mission.updatedAtUtc,
                envActions =
                missionDto.mission.envActions?.map {
                    MissionEnvActionDataOutput.fromEnvActionEntity(
                        envActionEntity = it,
                    )
                },
                missionSource = missionDto.mission.missionSource,
                hasMissionOrder = missionDto.mission.hasMissionOrder,
                isUnderJdp = missionDto.mission.isUnderJdp,
                isGeometryComputedFromControls = missionDto.mission.isGeometryComputedFromControls,
                hasRapportNavActions = missionDto.hasRapportNavActions,
            )
        }
    }
}
