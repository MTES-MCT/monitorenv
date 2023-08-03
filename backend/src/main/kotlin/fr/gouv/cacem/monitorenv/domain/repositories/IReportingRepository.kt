package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import org.springframework.data.domain.Pageable
import java.time.Instant

interface IReportingRepository {
    fun findById(reportingId: Int): ReportingEntity
    fun findAll(
        pageable: Pageable,
        startedAfter: Instant,
        startedBefore: Instant?,
    ): List<ReportingEntity>
    fun save(reporting: ReportingEntity): ReportingEntity
    fun delete(reportingId: Int)
    fun count(): Long
    fun archiveOutdatedReportings(): Int
}
