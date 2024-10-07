package fr.gouv.cacem.monitorenv.domain.entities.dashboard

import java.util.UUID

data class DashboardEntity(
    val id: UUID?,
    val name: String,
    val reportings: List<Int>,
    val amps: List<Int>,
    val vigilanceAreas: List<Int>,
    val regulatoryAreas: List<Int>,
    val inseeCode: String?,
)
