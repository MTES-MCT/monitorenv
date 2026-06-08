package fr.gouv.cacem.monitorenv.domain.entities.mission

import fr.gouv.cacem.monitorenv.domain.entities.Patchable
import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class MissionEntity(
    val id: Int? = null,
    @Patchable
    var controlUnits: List<LegacyControlUnitEntity> = listOf(),
    val completedBy: String? = null,
    val createdAtUtc: ZonedDateTime?,
    val envActions: List<EnvActionEntity>? = listOf(),
    @Patchable
    var endDateTimeUtc: ZonedDateTime? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val hasMissionOrder: Boolean,
    val isDeleted: Boolean,
    val isGeometryComputedFromControls: Boolean,
    val isNoteworthy: Boolean?,
    @Patchable
    var isUnderJdp: Boolean,
    val missionSource: MissionSourceEnum,
    @Patchable
    var missionTypes: List<MissionTypeEnum>,
    val missionTags: List<MissionTagEntity>,
    val observationsCacem: String? = null,
    @Patchable
    var observationsByUnit: String? = null,
    val observationsCnsp: String? = null,
    val openBy: String? = null,
    @Patchable
    var startDateTimeUtc: ZonedDateTime,
    val updatedAtUtc: ZonedDateTime?,
)
