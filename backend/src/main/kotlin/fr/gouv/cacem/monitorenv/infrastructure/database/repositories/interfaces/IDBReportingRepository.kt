package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingModel
import java.time.Instant
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface IDBReportingRepository : JpaRepository<ReportingModel, Int> {
    @Modifying(clearAutomatically = true)
    @Query(
            value =
                    """
        UPDATE reportings
        SET is_archived = TRUE
        WHERE (created_at + make_interval(hours => validity_time)) < NOW() AND is_archived IS FALSE
    """,
            nativeQuery = true,
    )
    fun archiveOutdatedReportings(): Int

    @Modifying(clearAutomatically = true)
    @Query(
            value =
                    """
        UPDATE reportings
        SET is_archived = TRUE
        WHERE id in (:ids)
    """,
            nativeQuery = true,
    )
    fun archiveReportings(ids: List<Int>)

    @Modifying(clearAutomatically = true)
    @Query(
            value =
                    """
        UPDATE reportings
        SET
            mission_id =  :missionId,
            attached_to_mission_at_utc = CASE WHEN mission_id is null AND id in (:reportingIds) THEN NOW() ELSE attached_to_mission_at_utc END,
            detached_from_mission_at_utc = CASE WHEN id not in (:reportingIds) THEN NOW() ELSE CAST(null as timestamp ) END
        WHERE id in (:reportingIds) or mission_id = :missionId
        """,
            nativeQuery = true,
    )
    fun attachReportingsToMission(reportingIds: List<Int>, missionId: Int)

    @Modifying(clearAutomatically = true)
    @Query(
            value =
                    """
        UPDATE reportings
        SET is_deleted = TRUE
        WHERE id = :id
    """,
            nativeQuery = true,
    )
    fun delete(id: Int)

    @Modifying(clearAutomatically = true)
    @Query(
            value =
                    """
        UPDATE reportings
        SET is_deleted = TRUE
        WHERE id in (:ids)
    """,
            nativeQuery = true,
    )
    fun deleteReportings(ids: List<Int>)

    @Query(
            value =
                    """
        SELECT *
        FROM reportings
        WHERE is_deleted IS FALSE
        AND created_at >= CAST(CAST(:startedAfter AS text) AS timestamp)
        AND (CAST(CAST(:startedBefore AS text) AS timestamp) IS NULL OR created_at <= CAST(CAST(:startedBefore AS text) AS timestamp))
        AND ((:seaFronts) = '{}' OR CAST(sea_front AS text) = ANY(CAST(:seaFronts as text[])))
        AND ((:sourcesType) = '{}' OR CAST(source_type AS text) = ANY(CAST(:sourcesType as text[])))
        AND ((:reportingType) = '{}' OR CAST(report_type AS text) = ANY(CAST(:reportingType as text[])))
        AND ((:status) = '{}'
            OR (
                'ARCHIVED' = ANY(CAST(:status as text[])) AND (
                    is_archived = true
                    OR (created_at + make_interval(hours => validity_time)) < NOW()
                ))
            OR (
                'IN_PROGRESS' = ANY(CAST(:status as text[])) AND (
                    is_archived = false
                    AND (created_at + make_interval(hours => validity_time)) >= NOW()
                )
            )
        )
        ORDER BY reporting_id DESC
    """,
            nativeQuery = true,
    )
    fun findAll(
            pageable: Pageable,
            reportingType: String?,
            seaFronts: String?,
            sourcesType: String?,
            startedAfter: Instant,
            startedBefore: Instant?,
            status: String?,
    ): List<ReportingModel>

    @Query(
            value =
                    """
        SELECT *
        FROM reportings
        WHERE control_unit_id = :controlUnitId
        """,
        nativeQuery = true,
    )
    fun findByControlUnitId(
        controlUnitId: Int,
    ): List<ReportingModel>

    @Query(
        value =
        """
        SELECT *
        FROM reportings
        WHERE mission_id = :missionId
        """,
            nativeQuery = true,
    )
    fun findByMissionId(
            missionId: Int,
    ): List<ReportingModel>
}
