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
            missionTypes = missionTypes,
            controlUnits = controlUnits.map { it.toControlUnitEntity() },
            controlResources =
                controlUnits.flatMap {
                    it.resources.map { resource ->
                        resource.toControlUnitResource()
                    }
                },
            openBy = openBy,
            completedBy = completedBy,
            observationsCacem = observationsCacem,
            observationsCnsp = observationsCnsp,
            facade = facade,
            geom = geom,
            startDateTimeUtc = startDateTimeUtc,
            endDateTimeUtc = endDateTimeUtc,
            isDeleted = false,
            missionSource = missionSource,
            hasMissionOrder = hasMissionOrder,
            isUnderJdp = isUnderJdp,
            isGeometryComputedFromControls = isGeometryComputedFromControls,
            createdAtUtc = createdAtUtc,
            updatedAtUtc = updatedAtUtc,
        )
}
