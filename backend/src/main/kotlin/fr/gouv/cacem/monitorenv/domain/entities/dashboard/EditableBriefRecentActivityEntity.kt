package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import java.time.ZonedDateTime

data class EditableBriefRecentActivityEntity(
    val startAfter: ZonedDateTime?,
    val startBefore: ZonedDateTime?,
    val period: String,
    val recentActivities: List<EditableBriefRecentControlActivityEntity>,
    val selectedControlUnits: List<EditableBriefRecentPerUnitActivityEntity>,
    val image: String? = null,
)
