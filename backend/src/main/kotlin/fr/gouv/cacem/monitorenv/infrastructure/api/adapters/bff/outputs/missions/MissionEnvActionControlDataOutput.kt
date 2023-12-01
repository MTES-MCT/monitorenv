package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import java.time.ZonedDateTime
import java.util.UUID
import org.locationtech.jts.geom.Geometry

data class MissionEnvActionControlDataOutput(
        override val id: UUID,
        val actionEndDateTimeUtc: ZonedDateTime? = null,
        val actionNumberOfControls: Int? = null,
        override val actionStartDateTimeUtc: ZonedDateTime? = null,
        val actionTargetType: ActionTargetTypeEnum? = null,
        override val actionType: ActionTypeEnum = ActionTypeEnum.CONTROL,
        val controlPlans: List<MissionEnvActionControlPlanDataOutput>? = listOf(),
        val department: String? = null,
        val facade: String? = null,
        val geom: Geometry? = null,
        val infractions: List<InfractionEntity>? = listOf(),
        val isAdministrativeControl: Boolean? = null,
        val isComplianceWithWaterRegulationsControl: Boolean? = null,
        val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,
        val isSeafarersControl: Boolean? = null,
        val observations: String? = null,
        val reportingIds: List<Int>,
        @Deprecated("Use controlPlans instead") val themes: List<ThemeEntity>? = listOf(),
        val controlPlanSubThemes: List<MissionEnvActionSubThemeDataOutput>? = listOf(),
        val vehicleType: VehicleTypeEnum? = null,
) :
        MissionEnvActionDataOutput(
                id = id,
                actionStartDateTimeUtc = actionStartDateTimeUtc,
                actionType = ActionTypeEnum.CONTROL,
        ) {
    companion object {
        fun fromEnvActionControlEntity(
                envActionControlEntity: EnvActionControlEntity,
                reportingIds: List<Int>,
        ) =
                MissionEnvActionControlDataOutput(
                        id = envActionControlEntity.id,
                        actionNumberOfControls = envActionControlEntity.actionNumberOfControls,
                        actionStartDateTimeUtc = envActionControlEntity.actionStartDateTimeUtc,
                        actionEndDateTimeUtc = envActionControlEntity.actionEndDateTimeUtc,
                        actionTargetType = envActionControlEntity.actionTargetType,
                        controlPlans =
                                envActionControlEntity.controlPlans?.map {
                                    MissionEnvActionControlPlanDataOutput
                                            .fromEnvActionControlPlanEntity(it)
                                },
                        department = envActionControlEntity.department,
                        facade = envActionControlEntity.facade,
                        geom = envActionControlEntity.geom,
                        infractions = envActionControlEntity.infractions,
                        isAdministrativeControl = envActionControlEntity.isAdministrativeControl,
                        isComplianceWithWaterRegulationsControl =
                                envActionControlEntity.isComplianceWithWaterRegulationsControl,
                        isSafetyEquipmentAndStandardsComplianceControl =
                                envActionControlEntity
                                        .isSafetyEquipmentAndStandardsComplianceControl,
                        isSeafarersControl = envActionControlEntity.isSeafarersControl,
                        observations = envActionControlEntity.observations,
                        themes = envActionControlEntity.themes,
                        vehicleType = envActionControlEntity.vehicleType,
                        reportingIds = reportingIds,
                )
    }
}
