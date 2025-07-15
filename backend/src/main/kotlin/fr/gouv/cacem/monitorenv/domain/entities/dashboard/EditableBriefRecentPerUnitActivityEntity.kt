package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class EditableBriefRecentPerUnitActivityEntity(
    val controlUnitId: Int,
    val recentControls: List<EditableBriefRecentControlActivityEntity>,
    val image: String? = null,
)
