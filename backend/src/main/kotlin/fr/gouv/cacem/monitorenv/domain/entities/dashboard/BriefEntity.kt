package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class BriefEntity(
    val dashboard: DashboardEntity,
    val images: List<BriefImageEntity>,
)
