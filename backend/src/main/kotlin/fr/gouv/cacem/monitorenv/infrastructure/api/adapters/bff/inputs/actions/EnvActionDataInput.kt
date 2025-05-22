package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.actions

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ActionTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionNoteEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionSurveillance.EnvActionSurveillanceEntity
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.MissionEnvActionControlInfractionDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions.MissionEnvActionControlPlanDataInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.tags.TagInput
import fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.themes.ThemeInput
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.Optional
import java.util.UUID

data class EnvActionDataInput(
    val id: UUID,
    val actionType: ActionTypeEnum,
    val actionStartDateTimeUtc: ZonedDateTime? = null,
    // Common to all action Types
    val observations: String? = null,
    // EnvActionControl + EnvSurveillance Properties
    val actionEndDateTimeUtc: ZonedDateTime? = null,
    val completedBy: String? = null,
    val completion: ActionCompletionEnum? = null,
    val controlPlans: List<MissionEnvActionControlPlanDataInput>? = null,
    val tags: List<TagInput> = emptyList(),
    val themes: List<ThemeInput> = emptyList(),
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,
    val openBy: String? = null,
    val awareness: AwarenessDataInput?,
    // EnvActionControl Properties
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val infractions: List<MissionEnvActionControlInfractionDataInput>? = listOf(),
    val isAdministrativeControl: Boolean? = null,
    val isComplianceWithWaterRegulationsControl: Boolean? = null,
    val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = null,
    val isSeafarersControl: Boolean? = null,
    // complementary properties
    val reportingIds: Optional<List<Int>>,
) {
    private fun validate() {
        when (actionType) {
            ActionTypeEnum.CONTROL ->
                require(this.reportingIds.isPresent && this.reportingIds.get().size < 2) {
                    "ReportingIds must not be null and maximum 1 id for Controls"
                }

            ActionTypeEnum.SURVEILLANCE ->
                require(this.reportingIds.isPresent) {
                    "ReportingIds must not be null for Surveillance Action"
                }

            ActionTypeEnum.NOTE ->
                require(
                    !this.reportingIds.isPresent,
                ) { "ReportingIds must not be present for Notes" }
        }
    }

    fun toEnvActionEntity(): EnvActionEntity {
        this.validate()

        return when (this.actionType) {
            ActionTypeEnum.CONTROL ->
                EnvActionControlEntity(
                    id = this.id,
                    actionEndDateTimeUtc = this.actionEndDateTimeUtc,
                    actionNumberOfControls = this.actionNumberOfControls,
                    actionTargetType = this.actionTargetType,
                    actionStartDateTimeUtc = this.actionStartDateTimeUtc,
                    completedBy = this.completedBy,
                    completion = this.completion,
                    controlPlans =
                        this.controlPlans?.map { it.toEnvActionControlPlanEntity() },
                    department = this.department,
                    facade = this.facade,
                    geom = this.geom,
                    infractions = this.infractions?.map { it.toInfractionEntity() },
                    isAdministrativeControl = this.isAdministrativeControl,
                    isComplianceWithWaterRegulationsControl =
                        this.isComplianceWithWaterRegulationsControl,
                    isSafetyEquipmentAndStandardsComplianceControl =
                        this.isSafetyEquipmentAndStandardsComplianceControl,
                    isSeafarersControl = this.isSeafarersControl,
                    observations = this.observations,
                    openBy = this.openBy,
                    vehicleType = this.vehicleType,
                    tags = tags.map { it.toTagEntity() },
                    themes = themes.map { it.toThemeEntity() },
                )

            ActionTypeEnum.SURVEILLANCE ->
                EnvActionSurveillanceEntity(
                    id = this.id,
                    actionStartDateTimeUtc = this.actionStartDateTimeUtc,
                    actionEndDateTimeUtc = this.actionEndDateTimeUtc,
                    completedBy = this.completedBy,
                    completion = this.completion,
                    controlPlans =
                        this.controlPlans?.map { it.toEnvActionControlPlanEntity() },
                    department = this.department,
                    facade = this.facade,
                    geom = this.geom,
                    observations = this.observations,
                    openBy = this.openBy,
                    awareness = awareness?.toAwarenessEntity(),
                    tags = tags.map { it.toTagEntity() },
                    themes = themes.map { it.toThemeEntity() },
                )

            ActionTypeEnum.NOTE ->
                EnvActionNoteEntity(
                    id = this.id,
                    actionStartDateTimeUtc = this.actionStartDateTimeUtc,
                    observations = this.observations,
                )
        }
    }
}
