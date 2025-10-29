package fr.gouv.cacem.monitorenv.domain.repositories

import fr.gouv.cacem.monitorenv.domain.entities.reporting.*
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingDetailsDTO
import fr.gouv.cacem.monitorenv.domain.use_cases.reportings.dtos.ReportingListDTO
import org.locationtech.jts.geom.Geometry
import java.time.Instant
import java.util.*

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
    ): List<ReportingListDTO>

    fun findByControlUnitId(controlUnitId: Int): List<ReportingEntity>

    fun findByMissionId(missionId: Int): List<ReportingDetailsDTO>

    fun findById(reportingId: Int): ReportingDetailsDTO?

    fun findAllById(reportingId: List<Int>): List<ReportingDetailsDTO>

    fun save(reporting: ReportingEntity): ReportingDetailsDTO

    fun findAllIdsByGeometry(geometry: Geometry): List<Int>

    fun findSuspicionOfInfractionsByMmsi(
        mmsi: String,
        idToExclude: Int?,
    ): List<SuspicionOfInfractions>
}
