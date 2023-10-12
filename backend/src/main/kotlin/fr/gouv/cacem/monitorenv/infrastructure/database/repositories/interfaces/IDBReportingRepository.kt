package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ReportingModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.time.Instant

@DynamicUpdate
interface IDBReportingRepository : CrudRepository<ReportingModel, Int> {

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
        SET is_deleted = TRUE
        WHERE id in (:ids)
    """,
        nativeQuery = true,
    )
    fun deleteReportings(ids: List<Int>)
}
