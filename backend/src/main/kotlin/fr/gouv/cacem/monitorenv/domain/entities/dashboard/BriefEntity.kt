package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class BriefEntity(
    val dashboard: DashboardEntity,
    val regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>? = listOf(),
    val images: List<BriefImageEntity>? = listOf(),
)
