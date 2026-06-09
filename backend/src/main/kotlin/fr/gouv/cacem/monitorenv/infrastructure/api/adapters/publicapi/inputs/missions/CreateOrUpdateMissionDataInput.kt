package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.inputs.controlUnits.LegacyControlUnitDataInput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class CreateOrUpdateMissionDataInput(
    val id: Int? = null,
    val missionTypes: List<MissionTypeEnum>,
    val controlUnits: List<LegacyControlUnitDataInput> = listOf(),
    val openBy: String? = null,
    val completedBy: String? = null,
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val startDateTimeUtc: ZonedDateTime,
    val endDateTimeUtc: ZonedDateTime? = null,
    val missionSource: MissionSourceEnum,
    val hasMissionOrder: Boolean,
    val isUnderJdp: Boolean,
    val isGeometryComputedFromControls: Boolean,
    val createdAtUtc: ZonedDateTime?,
    val updatedAtUtc: ZonedDateTime?,
) {
    fun toMissionEntity(): MissionEntity =
        MissionEntity(
            id = id,
            controlUnits = controlUnits.map { it.toLegacyControlUnit() },
            completedBy = completedBy,
            createdAtUtc = createdAtUtc,
            endDateTimeUtc = endDateTimeUtc,
            facade = facade,
            geom = geom,
            hasMissionOrder = hasMissionOrder,
            isDeleted = false,
            isNoteworthy = false,
            isUnderJdp = isUnderJdp,
            isGeometryComputedFromControls = isGeometryComputedFromControls,
            missionSource = missionSource,
            missionTypes = missionTypes,
            missionTags = listOf(),
            observationsCacem = observationsCacem,
            observationsCnsp = observationsCnsp,
            openBy = openBy,
            startDateTimeUtc = startDateTimeUtc,
            updatedAtUtc = updatedAtUtc,
        )
}
