package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingEntity
import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDTO
import org.locationtech.jts.geom.Geometry
import java.time.Instant
import java.util.UUID

interface IReportingRepository {
    fun archiveOutdatedReportings(): Int

    fun archiveReportings(ids: List<Int>)

    fun attachEnvActionsToReportings(
        envActionId: UUID,
        reportingIds: List<Int>,
    )

    fun attachReportingsToMission(
        reportingIds: List<Int>,
        missionId: Int,
    )

    fun detachDanglingEnvActions(
        missionId: Int,
        envActionIds: List<UUID>,
    )

    fun count(): Long

    fun delete(reportingId: Int)

    fun deleteReportings(ids: List<Int>)

    fun findAll(
        pageNumber: Int?,
        pageSize: Int?,
        reportingType: List<ReportingTypeEnum>?,
        seaFronts: List<String>?,
        sourcesType: List<SourceTypeEnum>?,
        startedAfter: Instant,
        startedBefore: Instant?,
        status: List<String>?,
        targetTypes: List<TargetTypeEnum>?,
        isAttachedToMission: Boolean?,
        searchQuery: String?,
    ): List<ReportingDTO>

    fun findByControlUnitId(controlUnitId: Int): List<ReportingEntity>

    fun findByMissionId(missionId: Int): List<ReportingDTO>

    fun findById(reportingId: Int): ReportingDTO

    fun save(reporting: ReportingEntity): ReportingDTO

    fun findAllByGeometry(geometry: Geometry): List<ReportingDTO>
}
