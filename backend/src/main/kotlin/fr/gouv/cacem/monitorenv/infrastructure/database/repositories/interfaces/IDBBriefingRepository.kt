package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.BriefingModel
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface IDBBriefingRepository : JpaRepository<BriefingModel, UUID> {
    fun deleteAllByDashboardId(dashboardId: UUID)
}
