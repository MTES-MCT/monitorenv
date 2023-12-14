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
    val missionSource: MissionSourceEnum,
    val isClosed: Boolean,
    val envActions: List<MissionEnvActionDataInput>? = null,
    val hasMissionOrder: Boolean? = false,
    val isUnderJdp: Boolean? = false,
    val attachedReportingIds: List<Int>,
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
            envActions = this.envActions?.map { it.toEnvActionEntity() },
            hasMissionOrder = hasMissionOrder,
            isUnderJdp = isUnderJdp,
            isGeometryComputedFromControls = false,
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
