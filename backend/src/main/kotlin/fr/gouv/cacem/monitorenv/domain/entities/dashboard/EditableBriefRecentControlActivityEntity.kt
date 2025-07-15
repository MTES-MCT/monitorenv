package fr.gouv.cacem.monitorenv.domain.entities.dashboard

data class EditableBriefRecentControlActivityEntity(
    val controlUnitIds: List<Int>,
    val nbControls: Int,
    val nbTarget: Int,
    val themeIds: List<Int>,
)
