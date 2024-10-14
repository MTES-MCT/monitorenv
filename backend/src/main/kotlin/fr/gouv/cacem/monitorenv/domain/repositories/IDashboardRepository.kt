package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity

interface IDashboardRepository {
    fun save(dashboard: DashboardEntity): DashboardEntity

    fun findAll(): List<DashboardEntity>
}
