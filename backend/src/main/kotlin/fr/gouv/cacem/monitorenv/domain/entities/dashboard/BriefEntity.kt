package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class BriefEntity(
    val dashboard: DashboardEntity,
    val regulatoryAreas: List<EditableBriefRegulatoryAreaEntity>? = listOf(),
    val image: BriefImageEntity? = null,
    val amps: List<EditableBriefAmpEntity>? = listOf(),
)
