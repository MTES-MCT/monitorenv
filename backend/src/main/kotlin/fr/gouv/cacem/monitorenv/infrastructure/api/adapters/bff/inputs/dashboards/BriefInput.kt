package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.*

class BriefInput(
    val dashboard: DashboardEntity,
    val image: BriefImageEntity? = null,
    val regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>? = listOf(),
    val amps: List<EditableBriefAmpEntity>? = listOf(),
) {
    fun toBriefEntity(): BriefEntity =
        BriefEntity(
            dashboard = dashboard,
            image = image,
            regulatoryAreas = regulatoryAreas,
            amps = amps,
        )
}
