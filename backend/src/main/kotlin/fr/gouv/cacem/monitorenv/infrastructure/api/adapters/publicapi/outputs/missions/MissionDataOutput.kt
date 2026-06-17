package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDetailsDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.actions.MissionEnvActionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlUnits.LegacyControlUnitDataOutput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class MissionDataOutput(
    override val id: Int,
    override val missionTypes: List<MissionTypeEnum>,
    override val controlUnits: List<LegacyControlUnitDataOutput>? = listOf(),
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
) : MissionOutput {
    companion object {
        fun fromMissionEntity(mission: MissionEntity): MissionDataOutput {
            requireNotNull(mission.id) { "a mission must have an id" }

            return MissionDataOutput(
                id = mission.id,
                missionTypes = mission.missionTypes,
                controlUnits =
                    mission.controlUnits.map {
                        LegacyControlUnitDataOutput.fromControlUnit(
                            it,
                            resources = mission.controlResources.filter { resource -> resource.controlUnitId == it.id },
                        )
                    },
                openBy = mission.openBy,
                completedBy = mission.completedBy,
                observationsByUnit = mission.observationsByUnit,
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

        fun fromMissionDTO(missionDto: MissionDetailsDTO): MissionDataOutput {
            requireNotNull(missionDto.mission.id) { "a mission must have an id" }

            return MissionDataOutput(
                id = missionDto.mission.id,
                missionTypes = missionDto.mission.missionTypes,
                controlUnits =
                    missionDto.mission.controlUnits.map {
                        LegacyControlUnitDataOutput.fromControlUnit(
                            it,
                            resources =
                                missionDto.mission.controlResources.filter { resource ->
                                    resource.controlUnitId ==
                                        it.id
                                },
                        )
                    },
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
            )
        }
    }
}
