package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.ThemeEntity
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionControlProperties(
    val themes: List<ThemeEntity>? = listOf(),
    val observations: String? = null,
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val infractions: List<InfractionEntity>? = listOf(),
) {
    fun toEnvActionControlEntity(
        id: UUID,
        actionStartDateTimeUtc: ZonedDateTime?,
        actionEndDateTimeUtc: ZonedDateTime?,
        facade: String?,
        department: String?,
        geom: Geometry?,
        isAdministrativeControl: Boolean?,
        isComplianceWithWaterRegulationsControl: Boolean?,
        isSafetyEquipmentAndStandardsComplianceControl: Boolean?,
        isSeafarersControl: Boolean?,
    ) =
        EnvActionControlEntity(
            id = id,
            actionStartDateTimeUtc = actionStartDateTimeUtc,
            actionEndDateTimeUtc = actionEndDateTimeUtc,
            facade = facade,
            department = department,
            geom = geom,
            themes = themes,
            observations = observations,
            actionNumberOfControls = actionNumberOfControls,
            actionTargetType = actionTargetType,
            vehicleType = vehicleType,
            infractions = infractions,
            isAdministrativeControl = isAdministrativeControl,
            isComplianceWithWaterRegulationsControl =
            isComplianceWithWaterRegulationsControl,
            isSafetyEquipmentAndStandardsComplianceControl =
            isSafetyEquipmentAndStandardsComplianceControl,
            isSeafarersControl = isSeafarersControl,
        )

    companion object {
        fun fromEnvActionControlEntity(envAction: EnvActionControlEntity) =
            EnvActionControlProperties(
                themes = envAction.themes,
                observations = envAction.observations,
                actionNumberOfControls = envAction.actionNumberOfControls,
                actionTargetType = envAction.actionTargetType,
                vehicleType = envAction.vehicleType,
                infractions = envAction.infractions,
            )
    }
}
