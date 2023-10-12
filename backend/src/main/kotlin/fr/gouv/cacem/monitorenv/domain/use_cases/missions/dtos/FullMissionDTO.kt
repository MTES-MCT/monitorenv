package fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.FullReportingDTO
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class FullMissionDTO(
    val id: Int? = null,
    val missionTypes: List<MissionTypeEnum>,
    val controlUnits: List<LegacyControlUnitEntity> = listOf(),
    val openBy: String? = null,
    val closedBy: String? = null,
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val startDateTimeUtc: ZonedDateTime,
    val endDateTimeUtc: ZonedDateTime? = null,
    val envActions: List<EnvActionEntity>? = listOf(),
    val isClosed: Boolean,
    val isDeleted: Boolean,
    val isGeometryComputedFromControls: Boolean,
    val missionSource: MissionSourceEnum,
    val hasMissionOrder: Boolean,
    val isUnderJdp: Boolean,
    val attachedReportings: List<FullReportingDTO>? = listOf(),
    val attachedReportingIds: List<Int>? = listOf(),
) {
    fun toMissionEntity(): MissionEntity =
        MissionEntity(
            id = id,
            missionTypes = missionTypes,
            controlUnits = controlUnits,
            openBy = openBy,
            closedBy = closedBy,
            observationsCacem = observationsCacem,
            observationsCnsp = observationsCnsp,
            facade = facade,
            geom = geom,
            startDateTimeUtc = startDateTimeUtc,
            endDateTimeUtc = endDateTimeUtc,
            envActions = envActions,
            isClosed = isClosed,
            isDeleted = isDeleted,
            isGeometryComputedFromControls = isGeometryComputedFromControls,
            missionSource = missionSource,
            hasMissionOrder = hasMissionOrder,
            isUnderJdp = isUnderJdp,
        )
}
