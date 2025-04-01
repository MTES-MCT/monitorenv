package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefImageEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefRegulatoryAreaEntity

class BriefInput(
    val dashboard: DashboardEntity,
    val image: BriefImageEntity? = null,
    val regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>? = listOf(),
) {
    fun toBriefEntity(): BriefEntity =
        BriefEntity(
            dashboard = dashboard,
            image = image,
            regulatoryAreas = regulatoryAreas,
        )
}
