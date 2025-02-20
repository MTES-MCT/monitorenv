package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity

class BriefInput(
    val dashboard: DashboardEntity,
    val images: List<BriefImageEntity>,
) {
    fun toBriefEntity(): BriefEntity =
        BriefEntity(
            dashboard = dashboard,
            images = images,
        )
}
