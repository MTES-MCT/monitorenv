package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import java.time.ZonedDateTime

data class EditableBriefRecentActivityEntity(
    val startAfter: ZonedDateTime?,
    val startBefore: ZonedDateTime?,
    val period: String,
    val recentActivitiesPerUnit: List<EditableBriefRecentPerUnitActivityEntity>,
    val image: String? = null,
)
