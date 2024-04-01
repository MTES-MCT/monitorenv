package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.missions

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.*
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.Optional
import java.util.UUID

data class MissionEnvActionDataInput(
    val id: UUID,
    val actionType: ActionTypeEnum,
    val actionStartDateTimeUtc: ZonedDateTime? = null,

    // Common to all action Types
    val observations: String? = null,

    // EnvActionControl + EnvSurveillance Properties
    val actionEndDateTimeUtc: ZonedDateTime? = null,
    val completion: EnvActionCompletionEnum? = null,
    val controlPlans: List<MissionEnvActionControlPlanDataInput>? = null,
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,

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
    fun validate() {
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

        when (this.actionType) {
            ActionTypeEnum.CONTROL ->
                return EnvActionControlEntity(
                    id = this.id,
                    actionEndDateTimeUtc = this.actionEndDateTimeUtc,
                    actionNumberOfControls = this.actionNumberOfControls,
                    actionTargetType = this.actionTargetType,
                    actionStartDateTimeUtc = this.actionStartDateTimeUtc,
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
                    vehicleType = this.vehicleType,
                )
            ActionTypeEnum.SURVEILLANCE ->
                return EnvActionSurveillanceEntity(
                    id = this.id,
                    actionStartDateTimeUtc = this.actionStartDateTimeUtc,
                    actionEndDateTimeUtc = this.actionEndDateTimeUtc,
                    completion = this.completion,
                    controlPlans =
                    this.controlPlans?.map { it.toEnvActionControlPlanEntity() },
                    department = this.department,
                    facade = this.facade,
                    geom = this.geom,
                    observations = this.observations,
                )
            ActionTypeEnum.NOTE ->
                return EnvActionNoteEntity(
                    id = this.id,
                    actionStartDateTimeUtc = this.actionStartDateTimeUtc,
                    observations = this.observations,
                )
            else -> throw Exception("Action type not supported")
        }
    }
}
