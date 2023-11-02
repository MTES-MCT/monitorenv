package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.*
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.EnvActionControlEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

// TODO It's unused, do we keep it?
data class CreateOrUpdateEnvActionDataInput(
    val id: UUID,
    val actionType: ActionTypeEnum,
    val actionStartDateTimeUtc: ZonedDateTime? = null,
    val actionEndDateTimeUtc: ZonedDateTime? = null,
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,
    val observations: String? = null,
    val isAdministrativeControl: Boolean? = false,
    val isComplianceWithWaterRegulationsControl: Boolean? = false,
    val isSafetyEquipmentAndStandardsComplianceControl: Boolean? = false,
    val isSeafarersControl: Boolean? = false,
    val themes: List<ThemeEntity>? = listOf(),
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val infractions: List<InfractionEntity>? = listOf(),
    val coverMissionZone: Boolean,
) {
    fun toEnvActionEntity(): EnvActionEntity {
        when (actionType) {
            ActionTypeEnum.CONTROL -> {
                return EnvActionControlEntity(
                    id = id,
                    actionStartDateTimeUtc = actionStartDateTimeUtc,
                    actionEndDateTimeUtc = actionEndDateTimeUtc,
                    department = department,
                    facade = facade,
                    geom = geom,
                    isAdministrativeControl = isAdministrativeControl ?: false,
                    isComplianceWithWaterRegulationsControl =
                    isComplianceWithWaterRegulationsControl ?: false,
                    isSafetyEquipmentAndStandardsComplianceControl =
                    isSafetyEquipmentAndStandardsComplianceControl ?: false,
                    isSeafarersControl = isSeafarersControl ?: false,
                    themes = themes,
                    observations = observations,
                    actionNumberOfControls = actionNumberOfControls,
                    actionTargetType = actionTargetType,
                    vehicleType = vehicleType,
                    infractions = infractions,
                )
            }
            ActionTypeEnum.SURVEILLANCE -> {
                return EnvActionSurveillanceEntity(
                    id = id,
                    actionStartDateTimeUtc = actionStartDateTimeUtc,
                    actionEndDateTimeUtc = actionEndDateTimeUtc,
                    department = department,
                    facade = facade,
                    geom = geom,
                    themes = themes,
                    observations = observations,
                    coverMissionZone = coverMissionZone,
                )
            }
            ActionTypeEnum.NOTE -> {
                return EnvActionNoteEntity(
                    id = id,
                    actionStartDateTimeUtc = actionStartDateTimeUtc,
                    actionEndDateTimeUtc = actionEndDateTimeUtc,
                    observations = observations,
                )
            }
            else -> {
                throw IllegalArgumentException("actionType $actionType is not valid")
            }
        }
    }
}
