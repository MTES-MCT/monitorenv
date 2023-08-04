package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository
import java.time.Instant

@DynamicUpdate
interface IDBMissionRepository : CrudRepository<MissionModel, Int> {
    // see https://github.com/spring-projects/spring-data-jpa/issues/2491
    // and https://stackoverflow.com/questions/55169797/pass-liststring-into-postgres-function-as-parameter
    // for ugly casting of passed parameters
    @Query(
        value = """
        SELECT * 
        FROM missions 
        WHERE
            deleted IS FALSE
            AND (
                start_datetime_utc >= CAST(CAST(:startedAfter AS text) AS timestamp)
                AND (CAST(CAST(:startedBefore AS text) AS timestamp) IS NULL OR start_datetime_utc <= CAST(CAST(:startedBefore AS text) AS timestamp))
                OR (
                    end_datetime_utc >= CAST(CAST(:startedAfter AS text) AS timestamp)
                    AND (CAST(CAST(:startedBefore AS text) AS timestamp) IS NULL OR end_datetime_utc <= CAST(CAST(:startedBefore AS text) AS timestamp))
                    )
            )
            AND ((:missionTypes) = '{}' OR mission_types && CAST(:missionTypes as text[]))
            AND ((:seaFronts) = '{}' OR CAST(facade AS text) = ANY(CAST(:seaFronts as text[])))
            AND ((:missionStatuses) = '{}'
                OR (
                    'UPCOMING' = ANY(CAST(:missionStatuses as text[])) AND (
                    start_datetime_utc >= now()
                    AND closed = FALSE
                    ))
                OR ( 
                    'PENDING' = ANY(CAST(:missionStatuses as text[])) AND (
                    (end_datetime_utc IS NULL OR end_datetime_utc >= now())
                    AND (start_datetime_utc <= now())
                    AND closed = FALSE
                    )
                )
                OR ( 
                    'ENDED' = ANY(CAST(:missionStatuses as text[])) AND (
                    end_datetime_utc < now() 
                    AND closed = FALSE
                    )
                )
                OR (
                    'CLOSED' = ANY(CAST(:missionStatuses as text[])) AND (
                    closed = TRUE
                    )
                ) 
            )
            AND ((:missionSources) = '{}' OR CAST(mission_source AS text) = ANY(CAST(:missionSources as text[])))
        ORDER BY start_datetime_utc DESC
        """,
        nativeQuery = true,
    )
    fun findAll(
        startedAfter: Instant,
        startedBefore: Instant?,
        missionTypes: String,
        missionStatuses: String,
        missionSources: String,
        seaFronts: String,
        pageable: Pageable,
    ): List<MissionModel>

    @Modifying(clearAutomatically = true)
    @Query(
        value = """
        UPDATE missions
        SET deleted = TRUE
        WHERE id = :id
    """,
        nativeQuery = true,
    )
    fun delete(id: Int)
}
