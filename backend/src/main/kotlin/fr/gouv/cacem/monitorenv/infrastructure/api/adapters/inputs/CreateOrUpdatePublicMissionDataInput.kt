package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.inputs

import fr.gouv.cacem.monitorenv.domain.entities.controlResources.ControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.missions.*
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class CreateOrUpdatePublicMissionDataInput(
    val id: Int? = null,
    val missionTypes: List<MissionTypeEnum>,
    val missionNature: List<MissionNatureEnum>? = listOf(),
    val controlUnits: List<ControlUnitEntity> = listOf(),
    val openBy: String? = null,
    val closedBy: String? = null,
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val facade: MissionSeaFrontEnum? = null,
    val geom: MultiPolygon? = null,
    val startDateTimeUtc: ZonedDateTime,
    val endDateTimeUtc: ZonedDateTime? = null,
    val missionSource: MissionSourceEnum,
    val isClosed: Boolean,
    val envActions: List<EnvActionEntity>? = null,
    val hasMissionOrder: Boolean,
    val isUnderJdp: Boolean
) {
    fun toMissionEntity(): MissionEntity {
        return MissionEntity(
            id = this.id,
            missionTypes = this.missionTypes,
            missionNature = this.missionNature,
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
            hasMissionOrder = this.hasMissionOrder,
            isUnderJdp = this.isUnderJdp
        )
    }
}
