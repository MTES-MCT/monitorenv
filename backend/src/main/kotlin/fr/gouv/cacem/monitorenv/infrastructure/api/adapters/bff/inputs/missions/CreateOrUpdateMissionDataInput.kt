package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionSourceEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.MissionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.missions.dtos.EnvActionAttachedToReportingIds
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.actions.EnvActionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.controlUnits.ControlUnitDataInput
import org.locationtech.jts.geom.MultiPolygon
import java.time.ZonedDateTime

data class CreateOrUpdateMissionDataInput(
    val id: Int? = null,
    val attachedReportingIds: List<Int>,
    val controlUnits: List<ControlUnitDataInput> = listOf(),
    val completedBy: String? = null,
    val envActions: List<EnvActionDataInput>? = null,
    val facade: String? = null,
    val geom: MultiPolygon? = null,
    val hasMissionOrder: Boolean? = false,
    val isNoteworthy: Boolean? = false,
    val isUnderJdp: Boolean? = false,
    val missionSource: MissionSourceEnum,
    val missionTypes: List<MissionTypeEnum>,
    val missionTags: List<MissionTagInput> = listOf(),
    val observationsCacem: String? = null,
    val observationsCnsp: String? = null,
    val openBy: String? = null,
    val startDateTimeUtc: ZonedDateTime,
    val endDateTimeUtc: ZonedDateTime? = null,
    val isGeometryComputedFromControls: Boolean = false,
) {
    fun toMissionEntity(): MissionEntity {
        val hasMissionOrder = this.hasMissionOrder == true
        val isUnderJdp = this.isUnderJdp == true

        return MissionEntity(
            id = this.id,
            completedBy = this.completedBy,
            controlUnits = this.controlUnits.map { it.toLegacyControlUnit() },
            createdAtUtc = null,
            envActions = this.envActions?.map { it.toEnvActionEntity() },
            endDateTimeUtc = this.endDateTimeUtc,
            facade = this.facade,
            geom = this.geom,
            hasMissionOrder = hasMissionOrder,
            isDeleted = false,
            isNoteworthy = isNoteworthy,
            isUnderJdp = isUnderJdp,
            isGeometryComputedFromControls = this.isGeometryComputedFromControls,
            missionSource = this.missionSource,
            missionTypes = this.missionTypes,
            missionTags = this.missionTags.map { it.toMissionTagEntity() }.toMutableList(),
            observationsCacem = this.observationsCacem,
            observationsCnsp = this.observationsCnsp,
            openBy = this.openBy,
            startDateTimeUtc = this.startDateTimeUtc,
            updatedAtUtc = null,
        )
    }

    fun getEnvActionsAttachedToReportings(): List<EnvActionAttachedToReportingIds> =
        this.envActions
            ?.filter {
                it.actionType == ActionTypeEnum.SURVEILLANCE ||
                    it.actionType == ActionTypeEnum.CONTROL
            }?.map { Pair(it.id, it.reportingIds.get()) }
            ?: listOf()
}
