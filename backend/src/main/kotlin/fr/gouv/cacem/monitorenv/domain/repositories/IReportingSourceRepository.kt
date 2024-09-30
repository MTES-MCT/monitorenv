package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingSourceEntity
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingSourceDTO

interface IReportingSourceRepository {
    fun save(reportingSourceEntity: ReportingSourceEntity): ReportingSourceDTO
}
