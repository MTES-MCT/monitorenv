package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.infractionsObservationsReport.InfractionsObservationsReportEntity
import org.springframework.data.domain.Pageable

interface IInfractionsObservationsReportRepository {
    fun findInfractionsObservationsReportById(InfractionsObservationsReportId: Int): InfractionsObservationsReportEntity
    fun findAllInfractionsObservationsReports(
        pageable: Pageable,
    ): List<InfractionsObservationsReportEntity>
    fun save(InfractionsObservationsReport: InfractionsObservationsReportEntity): InfractionsObservationsReportEntity
    fun delete(InfractionsObservationsReportId: Int)
    fun count(): Long
}
