package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.MissionListDTO
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.actions.EnvActionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlUnits.LegacyControlUnitDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.controlUnits.LegacyControlUnitDataOutput.Companion.fromLegacyControlUnit
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions.MissionTagDataOutput.Companion.fromMissionTagEntity
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class MissionsDataOutput(
    val id: Int,
    val attachedReportingIds: List<Int>? = listOf(),
    val completedBy: String? = null,
    val controlUnits: List<LegacyControlUnitDataOutput>? = listOf(),
    val endDateTimeUtc: ZonedDateTime? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val envActions: List<EnvActionDataOutput>? = null,
    val hasMissionOrder: Boolean,
    val isGeometryComputedFromControls: Boolean,
    val isNoteworthy: Boolean?,
    val isUnderJdp: Boolean,
    val missionSource: MissionSourceEnum,
    val missionTags: List<MissionTagDataOutput>,
    val missionTypes: List<MissionTypeEnum>,
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val openBy: String? = null,
    val startDateTimeUtc: ZonedDateTime,
) {
    companion object {
        fun fromMissionListDTO(dto: MissionListDTO): MissionsDataOutput {
            requireNotNull(dto.mission.id) { "a mission must have an id" }

            return MissionsDataOutput(
                id = dto.mission.id,
                missionTypes = dto.mission.missionTypes,
                controlUnits = dto.mission.controlUnits.map { fromLegacyControlUnit(it) },
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
                missionTags = dto.mission.missionTags.map { fromMissionTagEntity(it) },
                hasMissionOrder = dto.mission.hasMissionOrder,
                isUnderJdp = dto.mission.isUnderJdp,
                attachedReportingIds = dto.attachedReportingIds,
                isGeometryComputedFromControls = dto.mission.isGeometryComputedFromControls,
                isNoteworthy = dto.mission.isNoteworthy,
            )
        }
    }
}
