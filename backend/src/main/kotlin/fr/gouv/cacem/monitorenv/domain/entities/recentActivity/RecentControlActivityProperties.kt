package fr.gouv.cacem.monitorenv.domain.entities.recentActivity

import fr.gouv.cacem.monitorenv.domain.entities.VehicleTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.ActionTargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.mission.envAction.envActionControl.infraction.InfractionEntity

data class RecentControlActivityProperties(
    val actionNumberOfControls: Int? = null,
    val actionTargetType: ActionTargetTypeEnum? = null,
    val infractions: List<InfractionEntity>? = listOf(),
    val observations: String? = null,
    val vehicleType: VehicleTypeEnum? = null,
)
