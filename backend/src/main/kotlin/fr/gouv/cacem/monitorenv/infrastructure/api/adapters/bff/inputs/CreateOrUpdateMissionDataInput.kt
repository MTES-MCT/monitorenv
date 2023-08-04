package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.missions.MissionTypeEnum
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class CreateOrUpdateMissionDataInput(
    val id: Int? = null,
    val missionTypes: List<MissionTypeEnum>,
    val controlUnits: List<ControlUnitEntity> = listOf(),
    val openBy: String? = null,
    val closedBy: String? = null,
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val startDateTimeUtc: ZonedDateTime,
    val endDateTimeUtc: ZonedDateTime? = null,
    val missionSource: MissionSourceEnum,
    val isClosed: Boolean,
    val envActions: List<EnvActionEntity>? = null,
    val hasMissionOrder: Boolean? = false,
    val isUnderJdp: Boolean? = false,
) {
    fun toMissionEntity(): MissionEntity {
        val hasMissionOrder = this.hasMissionOrder ?: false
        val isUnderJdp = this.isUnderJdp ?: false

        return MissionEntity(
            id = this.id,
            missionTypes = this.missionTypes,
            controlUnits = this.controlUnits,
            openBy = this.openBy,
            closedBy = this.closedBy,
            observationsCacem = this.observationsCacem,
            observationsCnsp = this.observationsCnsp,
            facade = this.facade,
            geom = this.geom,
            startDateTimeUtc = this.startDateTimeUtc,
            endDateTimeUtc = this.endDateTimeUtc,
            isClosed = this.isClosed,
            isDeleted = false,
            missionSource = this.missionSource,
            envActions = this.envActions,
            hasMissionOrder = hasMissionOrder,
            isUnderJdp = isUnderJdp,
            isGeometryComputedFromControls = false,
        )
    }
}
