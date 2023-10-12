package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.FullReportingDTO
import org.springframework.data.domain.Pageable
import java.time.Instant

interface IReportingRepository {
    fun findById(reportingId: Int): FullReportingDTO
    fun findAll(
        pageable: Pageable,
        reportingType: List<ReportingTypeEnum>?,
        seaFronts: List<String>?,
        sourcesType: List<SourceTypeEnum>?,
        startedAfter: Instant,
        startedBefore: Instant?,
        status: List<String>?,
    ): List<ReportingEntity>
    fun findByAttachedMissionId(missionId: Int): List<ReportingEntity>
    fun save(reporting: ReportingEntity): FullReportingDTO
    fun delete(reportingId: Int)
    fun count(): Long
    fun archiveOutdatedReportings(): Int
    fun archiveReportings(ids: List<Int>)
    fun deleteReportings(ids: List<Int>)
}
