package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.EnvActionControlPlanEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionControlProperties(
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val infractions: List<InfractionEntity>? = listOf(),
    val observations: String? = null,
    @Deprecated("Use controlPlans instead") val themes: List<ThemeEntity>? = listOf(),
    val vehicleType: VehicleTypeEnum? = null,
) {
    fun toEnvActionControlEntity(
        id: UUID,
        actionEndDateTimeUtc: ZonedDateTime?,
        actionStartDateTimeUtc: ZonedDateTime?,
        controlPlans: List<EnvActionControlPlanEntity>?,
        department: String?,
        facade: String?,
        geom: Geometry?,
        isAdministrativeControl: Boolean?,
        isComplianceWithWaterRegulationsControl: Boolean?,
        isSafetyEquipmentAndStandardsComplianceControl: Boolean?,
        isSeafarersControl: Boolean?,
    ) =
        EnvActionControlEntity(
            id = id,
            actionEndDateTimeUtc = actionEndDateTimeUtc,
            actionNumberOfControls = actionNumberOfControls,
            actionStartDateTimeUtc = actionStartDateTimeUtc,
            actionTargetType = actionTargetType,
            controlPlans = controlPlans,
            department = department,
            facade = facade,
            geom = geom,
            infractions = infractions,
            isAdministrativeControl = isAdministrativeControl,
            isComplianceWithWaterRegulationsControl =
            isComplianceWithWaterRegulationsControl,
            isSafetyEquipmentAndStandardsComplianceControl =
            isSafetyEquipmentAndStandardsComplianceControl,
            isSeafarersControl = isSeafarersControl,
            observations = observations,
            themes = themes,
            vehicleType = vehicleType,
        )

    companion object {
        fun fromEnvActionControlEntity(envAction: EnvActionControlEntity) =
            EnvActionControlProperties(
                actionNumberOfControls = envAction.actionNumberOfControls,
                actionTargetType = envAction.actionTargetType,
                infractions = envAction.infractions,
                observations = envAction.observations,
                themes = envAction.themes,
                vehicleType = envAction.vehicleType,
            )
    }
}
