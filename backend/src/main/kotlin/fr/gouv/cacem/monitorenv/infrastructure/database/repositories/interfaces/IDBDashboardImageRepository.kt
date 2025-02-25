package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.DashboardImageModel
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface IDBDashboardImageRepository : JpaRepository<DashboardImageModel, UUID> {
    fun deleteAllByDashboardId(dashboardId: UUID)
}
