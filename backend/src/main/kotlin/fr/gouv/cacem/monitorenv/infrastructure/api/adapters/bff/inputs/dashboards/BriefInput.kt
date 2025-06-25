package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.dashboards

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.BriefEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefAmpEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefNearbyUnitEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefRegulatoryAreaEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.dashboard.EditableBriefVigilanceAreaEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.controlUnit.dtos.NearbyUnit

class BriefInput(
    val amps: List<EditableBriefAmpEntity>,
    val dashboard: DashboardEntity,
    val image: String?,
    val regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>,
    val reportings: List<EditableBriefReportingEntity>,
    val vigilanceAreas: List<EditableBriefVigilanceAreaEntity>,
    val nearbyUnits: List<NearbyUnit>,
) {
    fun toBriefEntity(): BriefEntity =
        BriefEntity(
            amps = amps,
            dashboard = dashboard,
            image = image,
            nearbyUnits =
                nearbyUnits.map { (controlUnit, missions) ->
                    EditableBriefNearbyUnitEntity(
                        controlUnit,
                        missions,
                    )
                },
            regulatoryAreas = regulatoryAreas,
            reportings = reportings,
            vigilanceAreas = vigilanceAreas,
        )
}
