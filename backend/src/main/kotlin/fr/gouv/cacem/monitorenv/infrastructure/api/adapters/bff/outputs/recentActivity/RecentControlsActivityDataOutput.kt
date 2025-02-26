package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.recentActivity

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO
import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime
import java.util.*

data class RecentControlsActivityDataOutput(
    val id: UUID,
    val actionNumberOfControls: Int? = null,
    val actionStartDateTimeUtc: ZonedDateTime? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val administrationIds: List<Int>,
    val controlUnitIds: List<Int>,
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,
    val infractions: List<InfractionEntity>? = listOf(),
    val missionId: Int? = null,
    val observations: String? = null,
    val subThemeIds: List<Int>,
    val themeIds: List<Int>,
    val vehicleType: VehicleTypeEnum? = null,
) {
    companion object {
        fun fromRecentControlsActivityDTO(recentControlActivity: RecentControlsActivityListDTO) =
            RecentControlsActivityDataOutput(
                id = recentControlActivity.id,
                actionNumberOfControls = recentControlActivity.actionNumberOfControls,
                actionStartDateTimeUtc = recentControlActivity.actionStartDateTimeUtc,
                actionTargetType = recentControlActivity.actionTargetType,
                administrationIds = recentControlActivity.administrationIds,
                controlUnitIds = recentControlActivity.controlUnitsIds,
                department = recentControlActivity.department,
                facade = recentControlActivity.facade,
                geom = recentControlActivity.geom,
                infractions = recentControlActivity.infractions,
                missionId = recentControlActivity.missionId,
                observations = recentControlActivity.observations,
                subThemeIds = recentControlActivity.subThemesIds,
                themeIds = recentControlActivity.themesIds,
                vehicleType = recentControlActivity.vehicleType,
            )
    }
}
