package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefAmpEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefRegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefVigilanceAreaEntity

class BriefInput(
    val amps: List<EditableBriefAmpEntity>? = listOf(),
    val dashboard: DashboardEntity,
    val image: String? = null,
    val regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>? = listOf(),
    val reportings: List<EditableBriefReportingEntity>? = listOf(),
    val vigilanceAreas: List<EditableBriefVigilanceAreaEntity>? = listOf(),
) {
    fun toBriefEntity(): BriefEntity =
        BriefEntity(
            amps = amps,
            dashboard = dashboard,
            image = image,
            regulatoryAreas = regulatoryAreas,
            reportings = reportings,
            vigilanceAreas = vigilanceAreas,
        )
}
