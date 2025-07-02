package fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.ActionCompletionEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.entities.tags.TagEntity
import fr.gouv.cacem.monitorenv.domain.entities.themes.ThemeEntity
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.UUID

data class EnvActionControlProperties(
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val infractions: List<InfractionEntity>? = listOf(),
    val observations: String? = null,
    val vehicleType: VehicleTypeEnum? = null,
) {
    fun toEnvActionControlEntity(
        id: UUID,
        actionEndDateTimeUtc: ZonedDateTime?,
        actionStartDateTimeUtc: ZonedDateTime?,
        completedBy: String?,
        completion: ActionCompletionEnum?,
        department: String?,
        facade: String?,
        geom: Geometry?,
        isAdministrativeControl: Boolean?,
        isComplianceWithWaterRegulationsControl: Boolean?,
        isSafetyEquipmentAndStandardsComplianceControl: Boolean?,
        isSeafarersControl: Boolean?,
        observationsByUnit: String?,
        openBy: String?,
        tags: List<TagEntity>,
        themes: List<ThemeEntity>,
    ) = EnvActionControlEntity(
        id = id,
        actionEndDateTimeUtc = actionEndDateTimeUtc,
        actionNumberOfControls = actionNumberOfControls,
        actionStartDateTimeUtc = actionStartDateTimeUtc,
        actionTargetType = actionTargetType,
        completedBy = completedBy,
        completion = completion,
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
        observationsByUnit = observationsByUnit,
        openBy = openBy,
        vehicleType = vehicleType,
        tags = tags,
        themes = themes,
    )

    companion object {
        fun fromEnvActionControlEntity(envAction: EnvActionControlEntity) =
            EnvActionControlProperties(
                actionNumberOfControls = envAction.actionNumberOfControls,
                actionTargetType = envAction.actionTargetType,
                infractions = envAction.infractions,
                observations = envAction.observations,
                vehicleType = envAction.vehicleType,
            )
    }
}
