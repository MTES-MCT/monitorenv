package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class MissionDataOutput(
    val id: Int,
    val missionTypes: List<MissionTypeEnum>,
    val controlUnits: List<LegacyControlUnitEntity>? = listOf(),
    val openBy: String? = null,
    val closedBy: String? = null, // TODO delete when Fish and RapportNav are removed
    val completedBy: String? = null,
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
    val isClosed: Boolean, // TODO delete when Fish and RapportNav are removed
    val hasMissionOrder: Boolean,
    val isUnderJdp: Boolean,
    val isGeometryComputedFromControls: Boolean,
) {
    companion object {
        fun fromMissionEntity(mission: MissionEntity): MissionDataOutput {
            requireNotNull(mission.id) { "a mission must have an id" }

            return MissionDataOutput(
                id = mission.id,
                missionTypes = mission.missionTypes,
                controlUnits = mission.controlUnits,
                openBy = mission.openBy,
                closedBy =
                mission.completedBy, // TODO delete when Fish and RapportNav are removed
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
                isClosed = false, // TODO delete when Fish and RapportNav are removed
                hasMissionOrder = mission.hasMissionOrder,
                isUnderJdp = mission.isUnderJdp,
                isGeometryComputedFromControls = mission.isGeometryComputedFromControls,
            )
        }
    }
}
