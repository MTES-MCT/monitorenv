package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.DashboardModel
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface IDBDashboardRepository : JpaRepository<DashboardModel, UUID>
