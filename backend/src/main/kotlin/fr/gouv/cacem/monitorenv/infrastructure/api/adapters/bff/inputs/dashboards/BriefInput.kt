package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefRegulatoryAreaEntity

class BriefInput(
    val dashboard: DashboardEntity,
    val images: List<BriefImageEntity>? = listOf(),
    val regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>? = listOf(),
) {
    fun toBriefEntity(): BriefEntity =
        BriefEntity(
            dashboard = dashboard,
            images = images,
            regulatoryAreas = regulatoryAreas,
        )
}
