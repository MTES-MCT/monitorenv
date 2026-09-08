package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.actions.MissionEnvActionDataOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.controlUnits.LegacyControlUnitDataOutput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

interface MissionOutput {
    val id: Int
    val completedBy: String?
    val controlUnits: List<LegacyControlUnitDataOutput>?
    val endDateTimeUtc: ZonedDateTime?
    val facade: String?
    val geom: MultiPolygon?
    val envActions: List<MissionEnvActionDataOutput>?
    val hasMissionOrder: Boolean
    val isGeometryComputedFromControls: Boolean
    val isNoteworthy: Boolean?
    val isUnderJdp: Boolean
    val missionSource: MissionSourceEnum
    val missionTags: List<MissionTagDataOutput>
    val missionTypes: List<MissionTypeEnum>
    val openBy: String?
    val observationsByUnit: String?
    val observationsCacem: String?
    val observationsCnsp: String?
    val startDateTimeUtc: ZonedDateTime
    val createdAtUtc: ZonedDateTime?
    val updatedAtUtc: ZonedDateTime?
}
