package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.dashboard.DashboardEntity
import java.util.*

interface IDashboardRepository {
    fun save(dashboard: DashboardEntity): DashboardEntity

    fun findById(id: UUID): DashboardEntity?

    fun findAll(): List<DashboardEntity>

    fun delete(id: UUID)
}
