package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.controlUnit.LegacyControlUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.EnvActionAttachedToReportingIds
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.actions.EnvActionDataInput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class CreateOrUpdateMissionDataInput(
    val id: Int? = null,
    val attachedReportingIds: List<Int>,
    val controlUnits: List<LegacyControlUnitEntity> = listOf(),
    val completedBy: String? = null,
    val envActions: List<EnvActionDataInput>? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val hasMissionOrder: Boolean? = false,
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
        val hasMissionOrder = this.hasMissionOrder == true
        val isUnderJdp = this.isUnderJdp == true

        return MissionEntity(
            id = this.id,
            completedBy = this.completedBy,
            controlUnits = this.controlUnits,
            endDateTimeUtc = this.endDateTimeUtc,
            envActions = this.envActions?.map { it.toEnvActionEntity() },
            facade = this.facade,
            geom = this.geom,
            hasMissionOrder = hasMissionOrder,
            isDeleted = false,
            isGeometryComputedFromControls = this.isGeometryComputedFromControls,
            isUnderJdp = isUnderJdp,
            missionSource = this.missionSource,
            missionTypes = this.missionTypes,
            observationsCacem = this.observationsCacem,
            observationsCnsp = this.observationsCnsp,
            openBy = this.openBy,
            startDateTimeUtc = this.startDateTimeUtc,
            createdAtUtc = null,
            updatedAtUtc = null,
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
