package fr.gouv.cacem.monitorenv.infrastructure.api.adapters.bff.inputs.recentActivity

import org.locationtech.jts.geom.Geometry
import java.time.ZonedDateTime

data class RecentControlsActivityDataInput(
    val administrationIds: List<Int>?,
    val controlUnitIds: List<Int>?,
    val geometry: Geometry?,
    val startedAfter: ZonedDateTime,
    val startedBefore: ZonedDateTime,
    val themeIds: List<Int>?,
)
