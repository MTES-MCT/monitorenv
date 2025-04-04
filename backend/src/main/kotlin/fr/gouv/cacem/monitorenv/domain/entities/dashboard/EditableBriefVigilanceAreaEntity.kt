package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import fr.gouv.cacem.monitorenv.domain.entities.vigilanceArea.LinkEntity
import java.time.ZonedDateTime

data class EditableBriefVigilanceAreaEntity(
    val color: String,
    val comments: String? = null,
    val endDatePeriod: ZonedDateTime? = null,
    val endingOccurenceDate: String,
    val frequency: String,
    val id: Int,
    val image: BriefImageEntity,
    val linkedAMPs: String? = null,
    val linkedRegulatoryAreas: String? = null,
    val links: List<LinkEntity>? = null,
    val name: String,
    val startDatePeriod: ZonedDateTime? = null,
    val themes: String? = null,
    val visibility: String? = null,
)
