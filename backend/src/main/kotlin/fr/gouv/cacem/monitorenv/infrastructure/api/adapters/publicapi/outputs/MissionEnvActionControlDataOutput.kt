package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.tags.TagOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.tags.TagOutput.Companion.fromTagEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.themes.ThemeOutput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.publicapi.outputs.themes.ThemeOutput.Companion.fromThemeEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class MissionEnvActionControlDataOutput(
    override val id: UUID?,
    val actionEndDateTimeUtc: ZonedDateTime? = null,
    val actionNumberOfControls: Int? = null,
    override val actionStartDateTimeUtc: ZonedDateTime? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    override val actionType: ActionTypeEnum = ActionTypeEnum.CONTROL,
    val completedBy: String? = null,
    val completion: ActionCompletionEnum? = null,
    val controlPlans: List<MissionEnvActionControlPlanDataOutput>? = listOf(),
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,
    val infractions: List<InfractionEntity>? = listOf(),
    val isAdministrativeControl: Boolean? = null,
    val isComplianceWithWaterRegulationsControl: Boolean? = null,
    val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,
    val isSeafarersControl: Boolean? = null,
    override val observationsByUnit: String? = null,
    val observations: String? = null,
    val openBy: String? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val tags: List<TagOutput>,
    val themes: List<ThemeOutput>,
) : MissionEnvActionDataOutput(
        id = id,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        actionType = ActionTypeEnum.CONTROL,
    ) {
    companion object {
        fun fromEnvActionControlEntity(envActionControlEntity: EnvActionControlEntity) =
            MissionEnvActionControlDataOutput(
                id = envActionControlEntity.id,
                actionNumberOfControls = envActionControlEntity.actionNumberOfControls,
                actionStartDateTimeUtc = envActionControlEntity.actionStartDateTimeUtc,
                actionEndDateTimeUtc = envActionControlEntity.actionEndDateTimeUtc,
                actionTargetType = envActionControlEntity.actionTargetType,
                completedBy = envActionControlEntity.completedBy,
                completion = envActionControlEntity.completion,
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
                observationsByUnit = envActionControlEntity.observationsByUnit,
                observations = envActionControlEntity.observations,
                openBy = envActionControlEntity.openBy,
                vehicleType = envActionControlEntity.vehicleType,
                tags = envActionControlEntity.tags.map { fromTagEntity(it) },
                themes = envActionControlEntity.themes.map { fromThemeEntity(it) },
            )
    }
}
