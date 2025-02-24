package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.outputs.recentActivity

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.recentActivity.dtos.RecentControlsActivityListDTO
import org.locationtech.jts.geom.Geometry
import java.util.*

data class RecentControlsActivityDataOutput(
    val id: UUID,
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val controlPlansThemeIds: List<Int>,
    val controlPlansSubThemeIds: List<Int>,
    val department: String? = null,
    val facade: String? = null,
    val geom: Geometry? = null,
    val infractions: List<InfractionEntity>? = listOf(),
    val missionId: Int? = null,
    val observations: String? = null,
    val vehicleType: VehicleTypeEnum? = null,
    val administrationIds: List<Int>,
    val controlUnitIds: List<Int>,
) {
    companion object {
        fun fromRecentControlsActivityDTO(recentControlActivity: RecentControlsActivityListDTO) =
            RecentControlsActivityDataOutput(
                id = recentControlActivity.id,
                actionNumberOfControls = recentControlActivity.actionNumberOfControls,
                actionTargetType = recentControlActivity.actionTargetType,
                controlPlansThemeIds = recentControlActivity.themesIds,
                controlPlansSubThemeIds = recentControlActivity.subThemesIds,
                department = recentControlActivity.department,
                facade = recentControlActivity.facade,
                geom = recentControlActivity.geom,
                infractions = recentControlActivity.infractions,
                observations = recentControlActivity.observations,
                vehicleType = recentControlActivity.vehicleType,
                administrationIds = recentControlActivity.administrationIds,
                controlUnitIds = recentControlActivity.controlUnitsIds,
            )
    }
}
