package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions.EnvActionControlDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions.EnvActionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions.EnvActionNoteDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions.EnvActionSurveillanceDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.monitorfish.adapters.MonitorFishMissionActionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.rapportnav.adapters.RapportNavMissionActionDataOutput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class MissionDataOutput(
    val id: Int,
    val missionTypes: List<MissionTypeEnum>,
    val controlUnits: List<LegacyControlUnitEntity>? = listOf(),
    val openBy: String? = null,
    val completedBy: String? = null,
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val startDateTimeUtc: ZonedDateTime,
    val endDateTimeUtc: ZonedDateTime? = null,
    val createdAtUtc: ZonedDateTime? = null,
    val updatedAtUtc: ZonedDateTime? = null,
    val envActions: List<EnvActionDataOutput>? = null,
    val fishActions: List<MonitorFishMissionActionDataOutput>? = listOf(),
    val missionSource: MissionSourceEnum,
    val hasMissionOrder: Boolean,
    val isUnderJdp: Boolean,
    val attachedReportingIds: List<Int>? = listOf(),
    val attachedReportings: List<MissionAttachedReportingDataOutput>? = listOf(),
    val detachedReportingIds: List<Int>? = listOf(),
    val detachedReportings: List<MissionDetachedReportingDataOutput>? = listOf(),
    val isGeometryComputedFromControls: Boolean,
    val hasRapportNavActions: RapportNavMissionActionDataOutput? = null,
) {

    companion object {
        fun fromMissionDTO(dto: MissionDTO): MissionDataOutput {
            requireNotNull(dto.mission.id) { "a mission must have an id" }

            return MissionDataOutput(
                id = dto.mission.id,
                missionTypes = dto.mission.missionTypes,
                controlUnits = dto.mission.controlUnits,
                openBy = dto.mission.openBy,
                completedBy = dto.mission.completedBy,
                observationsCacem = dto.mission.observationsCacem,
                observationsCnsp = dto.mission.observationsCnsp,
                facade = dto.mission.facade,
                geom = dto.mission.geom,
                startDateTimeUtc = dto.mission.startDateTimeUtc,
                endDateTimeUtc = dto.mission.endDateTimeUtc,
                createdAtUtc = dto.mission.createdAtUtc,
                updatedAtUtc = dto.mission.updatedAtUtc,
                envActions =
                (
                    dto.mission.envActions?.map {
                        when (it.actionType) {
                            ActionTypeEnum.CONTROL ->
                                EnvActionControlDataOutput
                                    .fromEnvActionControlEntity(
                                        envActionControlEntity =
                                        it as EnvActionControlEntity,
                                        reportingIds =
                                        dto.envActionsAttachedToReportingIds
                                            ?.find { action ->
                                                action.first ==
                                                    it.id
                                            }
                                            ?.second
                                            ?: listOf(),
                                    )

                            ActionTypeEnum.SURVEILLANCE -> {
                                EnvActionSurveillanceDataOutput
                                    .fromEnvActionSurveillanceEntity(
                                        envActionSurveillanceEntity =
                                        it as EnvActionSurveillanceEntity,
                                        reportingIds =
                                        dto.envActionsAttachedToReportingIds
                                            ?.find { action ->
                                                action.first == it.id
                                            }
                                            ?.second
                                            ?: listOf(),
                                    )
                            }

                            ActionTypeEnum.NOTE ->
                                EnvActionNoteDataOutput.fromEnvActionNoteEntity(
                                    it as EnvActionNoteEntity,
                                )
                        }
                    }
                    ),
                fishActions =
                dto.fishActions?.map {
                    MonitorFishMissionActionDataOutput
                        .fromMonitorFishMissionActionEntity(it)
                },
                missionSource = dto.mission.missionSource,
                hasMissionOrder = dto.mission.hasMissionOrder,
                isUnderJdp = dto.mission.isUnderJdp,
                attachedReportingIds = dto.attachedReportingIds,
                attachedReportings =
                dto.attachedReportings?.map {
                    MissionAttachedReportingDataOutput.fromReportingDTO(it)
                },
                detachedReportingIds = dto.detachedReportingIds,
                detachedReportings =
                dto.detachedReportings?.map {
                    MissionDetachedReportingDataOutput.fromReporting(it.reporting)
                },
                isGeometryComputedFromControls = dto.mission.isGeometryComputedFromControls,
                hasRapportNavActions = dto.hasRapportNavActions?.let {
                    RapportNavMissionActionDataOutput.fromRapportNavMissionActionEntity(it)
                },
            )
        }
    }
}
