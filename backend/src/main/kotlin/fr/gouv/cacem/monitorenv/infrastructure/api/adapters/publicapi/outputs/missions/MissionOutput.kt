package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.actions.MissionEnvActionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlUnits.LegacyControlUnitDataOutput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

interface MissionOutput {
    val id: Int
    val missionTypes: List<MissionTypeEnum>
    val controlUnits: List<LegacyControlUnitDataOutput>?
    val openBy: String?
    val completedBy: String?
    val observationsByUnit: String?
    val observationsCacem: String?
    val observationsCnsp: String?
    val facade: String?
    val geom: MultiPolygon?
    val startDateTimeUtc: ZonedDateTime
    val endDateTimeUtc: ZonedDateTime?
    val createdAtUtc: ZonedDateTime?
    val updatedAtUtc: ZonedDateTime?
    val envActions: List<MissionEnvActionDataOutput>?
    val missionSource: MissionSourceEnum
    val hasMissionOrder: Boolean
    val isUnderJdp: Boolean
    val isGeometryComputedFromControls: Boolean
}
