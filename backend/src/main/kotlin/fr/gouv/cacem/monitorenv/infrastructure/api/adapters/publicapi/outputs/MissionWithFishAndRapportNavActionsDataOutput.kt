package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.infrastructure.monitorfish.adapters.MonitorFishMissionActionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.rapportnav.adapters.RapportNavMissionActionDataOutput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class MissionWithFishAndRapportNavActionsDataOutput(
    override val id: Int,
    override val missionTypes: List<MissionTypeEnum>,
    override val controlUnits: List<LegacyControlUnitEntity>? = listOf(),
    override val openBy: String? = null,
    override val completedBy: String? = null,
    override val observationsByUnit: String? = null,
    override val observationsCacem: String? = null,
    override val observationsCnsp: String? = null,
    override val facade: String? = null,
    override val geom: MultiPolygon? = null,
    override val startDateTimeUtc: ZonedDateTime,
    override val endDateTimeUtc: ZonedDateTime? = null,
    override val createdAtUtc: ZonedDateTime? = null,
    override val updatedAtUtc: ZonedDateTime? = null,
    override val envActions: List<MissionEnvActionDataOutput>? = null,
    override val missionSource: MissionSourceEnum,
    override val hasMissionOrder: Boolean,
    override val isUnderJdp: Boolean,
    override val isGeometryComputedFromControls: Boolean,
    val hasRapportNavActions: RapportNavMissionActionDataOutput? = null,
    val fishActions: List<MonitorFishMissionActionDataOutput>? = listOf(),
) : MissionOutput {
    companion object {
        fun fromMissionDTO(missionDto: MissionDetailsDTO): MissionWithFishAndRapportNavActionsDataOutput {
            requireNotNull(missionDto.mission.id) { "a mission must have an id" }

            return MissionWithFishAndRapportNavActionsDataOutput(
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
                fishActions =
                    missionDto.fishActions?.map {
                        MonitorFishMissionActionDataOutput.fromMonitorFishMissionActionEntity(
                            it,
                        )
                    },
                hasRapportNavActions =
                    missionDto.hasRapportNavActions?.let {
                        RapportNavMissionActionDataOutput.fromRapportNavMissionActionEntity(
                            it,
                        )
                    },
            )
        }
    }
}
