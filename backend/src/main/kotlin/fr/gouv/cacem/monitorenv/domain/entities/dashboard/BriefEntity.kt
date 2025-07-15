package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class BriefEntity(
    val amps: List<EditableBriefAmpEntity>,
    val dashboard: DashboardEntity,
    val image: String? = null,
    val nearbyUnits: List<EditableBriefNearbyUnitEntity>,
    val recentActivity: EditableBriefRecentActivityEntity,
    val regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>,
    val reportings: List<EditableBriefReportingEntity>,
    val vigilanceAreas: List<EditableBriefVigilanceAreaEntity>,
)
