package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import java.util.UUID

class BriefingEntity(
    val id: UUID?,
    val reportingId: Int?,
    val ampId: Int?,
    val vigilanceAreaId: Int?,
    val regulatoryAreaId: Int?,
    val inseeCode: String?,
)
