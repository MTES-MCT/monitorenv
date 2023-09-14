package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import java.time.Instant
import org.springframework.data.domain.Pageable

interface IReportingRepository {
    fun findById(reportingId: Int): ReportingEntity
    fun findAll(
            pageable: Pageable,
            reportingType: List<ReportingTypeEnum>?,
            seaFronts: List<String>?,
            sourcesType: List<SourceTypeEnum>?,
            startedAfter: Instant,
            startedBefore: Instant?,
            status: List<String>?,
    ): List<ReportingEntity>
    fun save(reporting: ReportingEntity): ReportingEntity
    fun delete(reportingId: Int)
    fun count(): Long
    fun archiveOutdatedReportings(): Int
    fun archiveReportings(ids: List<Int>)
}
