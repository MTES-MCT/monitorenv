package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class BriefEntity(
    val amps: List<EditableBriefAmpEntity>? = listOf(),
    val dashboard: DashboardEntity,
    val image: BriefImageEntity? = null,
    val regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>? = listOf(),
    val reportings: List<EditableBriefReportingEntity>? = listOf(),
    val vigilanceAreas: List<EditableBriefVigilanceAreaEntity>? = listOf(),
)
