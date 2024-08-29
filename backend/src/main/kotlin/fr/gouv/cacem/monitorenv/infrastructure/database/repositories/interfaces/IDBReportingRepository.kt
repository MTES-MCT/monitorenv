package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.domain.entities.reporting.ReportingTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.SourceTypeEnum
import fr.gouv.cacem.monitorenv.domain.entities.reporting.TargetTypeEnum
import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingModel
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.EntityGraph
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

    @EntityGraph(value = "ReportingModel.fullLoad", type = EntityGraph.EntityGraphType.LOAD)
    @Query(
        """
        SELECT DISTINCT  r
        FROM ReportingModel r
        WHERE r.isDeleted IS FALSE
            AND r.createdAt >= CAST(CAST(:startedAfter as text) AS timestamp)
            AND (CAST(CAST(:startedBefore as text) AS timestamp) IS NULL OR r.createdAt <= CAST(CAST(:startedBefore as text) AS timestamp))
            AND (:seaFronts IS NULL OR r.seaFront IN (:seaFronts))
            AND (:sourcesType IS NULL OR EXISTS (
                SELECT 1
                FROM ReportingSourceModel rs
                WHERE rs.reporting.id = r.id
                AND rs.sourceType IN (:sourcesType)
            ))
            AND (:reportingType IS NULL OR r.reportType IN (:reportingType))
            AND (:status IS NULL
                OR (
                    'ARCHIVED' IN (:status) AND
                        (r.isArchived = true
                        OR r.validityEndTime < CURRENT_TIMESTAMP)
                    )
                OR (
                    'IN_PROGRESS' IN :status AND (
                        r.isArchived = false
                        AND r.validityEndTime >= CURRENT_TIMESTAMP
                    )
                )
            )
            AND (:targetTypes IS NULL OR r.targetType IN (:targetTypes))
            AND (:isAttachedToMission IS NULL
                OR (
                    :isAttachedToMission = true AND (
                        r.mission.id IS NOT NULL
                        AND r.detachedFromMissionAtUtc IS NULL
                    )
                )
                OR (
                    :isAttachedToMission = false AND (
                        r.mission.id IS NULL
                        OR (
                            r.mission.id IS NOT NULL
                            AND r.detachedFromMissionAtUtc IS NOT NULL
                        )
                    )
                )
            )
        ORDER BY r.reportingId DESC
    """,
    )
    fun findAll(
        pageable: Pageable,
        reportingType: List<ReportingTypeEnum>? = emptyList(),
        seaFronts: List<String>? = emptyList(),
        sourcesType: List<SourceTypeEnum>? = emptyList(),
        startedAfter: Instant,
        startedBefore: Instant?,
        status: List<String>? = emptyList(),
        targetTypes: List<TargetTypeEnum>? = emptyList(),
        isAttachedToMission: Boolean?,
    ): List<ReportingModel>

    @EntityGraph(value = "ReportingModel.fullLoad", type = EntityGraph.EntityGraphType.LOAD)
    @Query(
        value =
        """
        SELECT r
        FROM ReportingModel r
        INNER JOIN ReportingSourceModel rs ON r.id = rs.reporting.id
        WHERE rs.controlUnit.id = :controlUnitId
        """,
    )
    fun findByControlUnitId(
        controlUnitId: Int,
    ): List<ReportingModel>

    @Query(
        value =
        """
        SELECT r
        FROM ReportingModel r
        WHERE r.mission.id = :missionId
        """,
    )
    fun findByMissionId(
        missionId: Int,
    ): List<ReportingModel>
}
