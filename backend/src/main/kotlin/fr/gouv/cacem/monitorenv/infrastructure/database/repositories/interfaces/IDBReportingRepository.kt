package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingModel
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import java.time.Instant
import java.util.UUID

interface IDBReportingRepository : JpaRepository<ReportingModel, Int> {
    @Modifying(clearAutomatically = true, flushAutomatically = true)
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

    @Modifying(clearAutomatically = true, flushAutomatically = true)
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

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        value =
        """
        UPDATE reportings
        SET
            mission_id = :missionId,
            attached_to_mission_at_utc = CASE WHEN (mission_id IS NULL OR mission_id = (:missionId)) AND id IN (:reportingIds) THEN NOW() ELSE attached_to_mission_at_utc END,
            detached_from_mission_at_utc = CASE WHEN (id NOT IN (:reportingIds) OR (:reportingIds) IS NULL ) THEN NOW() ELSE NULL END
            WHERE id IN (:reportingIds) OR (mission_id = :missionId AND detached_from_mission_at_utc IS NULL)
            """,
        nativeQuery = true,
    )
    fun attachReportingsToMission(reportingIds: List<Int>, missionId: Int)

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        value =
        """
        UPDATE reportings
            SET attached_env_action_id = CASE WHEN id in (:reportingIds) THEN :envActionId ELSE NULL END
            WHERE id in (:reportingIds) or attached_env_action_id = :envActionId
        """,
        nativeQuery = true,
    )
    fun attachEnvActionsToReportings(envActionId: UUID, reportingIds: List<Int>)

    @Modifying(clearAutomatically = true, flushAutomatically = true)
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

    @Modifying(clearAutomatically = true, flushAutomatically = true)
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

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(
        value =
        """
        UPDATE reportings
        SET attached_env_action_id = NULL
        WHERE mission_id = :missionId AND (:envActionIds IS NULL OR attached_env_action_id NOT IN (:envActionIds))
        """,
        nativeQuery = true,
    )
    fun detachDanglingEnvActions(missionId: Int, envActionIds: List<UUID>)

    @Query(
        value =
        """
        SELECT r.*
        FROM reportings r
        WHERE r.is_deleted IS FALSE
            AND r.created_at >= CAST(:startedAfter AS timestamp)
            AND (CAST(:startedBefore AS timestamp) IS NULL OR r.created_at <= CAST(:startedBefore AS timestamp))
            AND ((:seaFronts) = '{}' OR CAST(r.sea_front AS text) = ANY(CAST(:seaFronts as text[])))
            AND ((:sourcesType) = '{}' OR EXISTS (SELECT 1 FROM reportings_source rs WHERE rs.reportings_id = r.id AND CAST(rs.source_type as text) = ANY((:sourcesType)::text[])))
            AND ((:reportingType) = '{}' OR CAST(r.report_type AS text) = ANY(CAST(:reportingType as text[])))
            AND ((:status) = '{}'
                OR (
                    'ARCHIVED' = ANY(CAST(:status as text[])) AND (
                        r.is_archived = true
                        OR (r.created_at + make_interval(hours => r.validity_time)) < NOW()
                    )
                )
                OR (
                    'IN_PROGRESS' = ANY(CAST(:status as text[])) AND (
                        r.is_archived = false
                        AND (r.created_at + make_interval(hours => r.validity_time)) >= NOW()
                    )
                )
            )
            AND ((:targetTypes) = '{}' OR CAST(r.target_type AS text) = ANY(CAST(:targetTypes as text[])))
            AND ((:isAttachedToMission) IS NULL
                OR (
                    (:isAttachedToMission) = true AND (
                        r.mission_id IS NOT NULL
                        AND r.detached_from_mission_at_utc IS NULL
                    )
                )
                OR (
                    (:isAttachedToMission) = false AND (
                        r.mission_id IS NULL
                        OR (
                            r.mission_id IS NOT NULL AND
                            r.detached_from_mission_at_utc IS NOT NULL
                        )
                    )
                )
            )
            AND ((:searchQuery) = ''
                OR (
                    to_tsvector('mydict', r.target_details) @@ to_tsquery('mydict', (:searchQuery || ':*'))
                    )
                OR (
                    unaccent(CAST(r.description as text))
                    ILIKE unaccent(CAST('%'|| CAST((:searchQuery) as text) || '%' as text))
                )
            )
            ORDER BY r.reporting_id DESC
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
        targetTypes: String?,
        isAttachedToMission: Boolean?,
        searchQuery: String,
    ): List<ReportingModel>

    @Query(
        value =
        """
        SELECT r.*
        FROM reportings r
        INNER JOIN reportings_source rs ON r.id = rs.reportings_id
        WHERE rs.control_unit_id = :controlUnitId
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
