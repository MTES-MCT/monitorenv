package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingSourceModel
import org.springframework.data.jpa.repository.JpaRepository
import java.util.UUID

interface IDBReportingSourceRepository : JpaRepository<ReportingSourceModel, UUID>
