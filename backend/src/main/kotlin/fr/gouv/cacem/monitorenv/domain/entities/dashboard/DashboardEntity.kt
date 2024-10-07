package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import java.util.UUID

class DashboardEntity(
    val id: UUID?,
    val name: String,
    val briefings: List<BriefingEntity>,
)
