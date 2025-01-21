package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionListDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions.EnvActionDataOutput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class MissionsDataOutput(
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
    val envActions: List<EnvActionDataOutput>? = null,
    val missionSource: MissionSourceEnum,
    val hasMissionOrder: Boolean,
    val isUnderJdp: Boolean,
    val attachedReportingIds: List<Int>? = listOf(),
    val isGeometryComputedFromControls: Boolean,
) {
    companion object {
        fun fromMissionListDTO(dto: MissionListDTO): MissionsDataOutput {
            requireNotNull(dto.mission.id) { "a mission must have an id" }

            return MissionsDataOutput(
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
                envActions =
                    dto.mission.envActions?.map {
                        EnvActionDataOutput.fromEnvActionEntity(
                            envActionEntity = it,
                            listOf(),
                        )
                    },
                missionSource = dto.mission.missionSource,
                hasMissionOrder = dto.mission.hasMissionOrder,
                isUnderJdp = dto.mission.isUnderJdp,
                attachedReportingIds = dto.attachedReportingIds,
                isGeometryComputedFromControls = dto.mission.isGeometryComputedFromControls,
            )
        }
    }
}
