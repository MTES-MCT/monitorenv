package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.EnvActionAttachedToReportingIds
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class CreateOrUpdateMissionDataInput(
    val id: Int? = null,
    val attachedReportingIds: List<Int>,
    val controlUnits: List<LegacyControlUnitEntity> = listOf(),
    val closedBy: String? = null,
    val envActions: List<MissionEnvActionDataInput>? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val hasMissionOrder: Boolean? = false,
    val isClosed: Boolean,
    val isUnderJdp: Boolean? = false,
    val missionSource: MissionSourceEnum,
    val missionTypes: List<MissionTypeEnum>,
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val openBy: String? = null,
    val startDateTimeUtc: ZonedDateTime,
    val endDateTimeUtc: ZonedDateTime? = null,
    val isGeometryComputedFromControls: Boolean,
) {
    fun toMissionEntity(): MissionEntity {
        val hasMissionOrder = this.hasMissionOrder ?: false
        val isUnderJdp = this.isUnderJdp ?: false

        return MissionEntity(
            id = this.id,
            closedBy = this.closedBy,
            controlUnits = this.controlUnits,
            endDateTimeUtc = this.endDateTimeUtc,
            envActions = this.envActions?.map { it.toEnvActionEntity() },
            facade = this.facade,
            geom = this.geom,
            hasMissionOrder = hasMissionOrder,
            isClosed = this.isClosed,
            isDeleted = false,
            isGeometryComputedFromControls = this.isGeometryComputedFromControls,
            isUnderJdp = isUnderJdp,
            missionSource = this.missionSource,
            missionTypes = this.missionTypes,
            observationsCacem = this.observationsCacem,
            observationsCnsp = this.observationsCnsp,
            openBy = this.openBy,
            startDateTimeUtc = this.startDateTimeUtc,
        )
    }

    fun getEnvActionsAttachedToReportings(): List<EnvActionAttachedToReportingIds> {
        return this.envActions
            ?.filter {
                it.actionType == ActionTypeEnum.SURVEILLANCE ||
                    it.actionType == ActionTypeEnum.CONTROL
            }
            ?.map { Pair(it.id, it.reportingIds.get()) }
            ?: listOf()
    }
}
