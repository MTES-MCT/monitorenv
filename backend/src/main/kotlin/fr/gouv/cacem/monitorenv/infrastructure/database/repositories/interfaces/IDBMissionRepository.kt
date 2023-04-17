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
            AND start_datetime_utc >= :startedAfter
            AND (CAST(CAST(:startedBefore AS text) AS timestamp) IS NULL OR start_datetime_utc <= CAST(CAST(:startedBefore AS text) AS timestamp))
            AND (list_to_array(:missionNatures) IS NULL OR mission_nature && list_to_array(:missionNatures))
            AND (list_to_array(:missionTypes) IS NULL OR mission_types && list_to_array(:missionTypes))
            AND (list_to_array(:seaFronts) IS NULL OR CAST(facade AS text) = ANY(list_to_array(:seaFronts)))
            AND (list_to_array(:missionStatuses) IS NULL 
                OR (
                    'UPCOMING' = ANY(list_to_array(:missionStatuses)) AND (
                    start_datetime_utc >= now()
                    AND closed = FALSE
                    ))
                OR ( 
                    'PENDING' = ANY(list_to_array(:missionStatuses)) AND (
                    (end_datetime_utc IS NULL OR end_datetime_utc >= now())
                    AND closed = FALSE
                    )
                )
                OR ( 
                    'ENDED' = ANY(list_to_array(:missionStatuses)) AND (
                    end_datetime_utc < now() 
                    AND closed = FALSE
                    )
                )
                OR (
                    'CLOSED' = ANY(list_to_array(:missionStatuses)) AND (
                    closed = TRUE
                    )
                ) 
            )
            AND (list_to_array(:missionSources) IS NULL OR CAST(mission_source AS text) = ANY(list_to_array(:missionSources)))
        ORDER BY start_datetime_utc DESC
        """,
        nativeQuery = true
    )
    fun findAllMissions(
        startedAfter: Instant,
        startedBefore: Instant?,
        missionNatures: List<String>?,
        missionTypes: List<String>?,
        missionStatuses: List<String>?,
        missionSources: List<String>?,
        seaFronts: List<String>?,
        pageable: Pageable
    ): List<MissionModel>

    @Modifying(clearAutomatically = true)
    @Query(
        value = """
        UPDATE missions
        SET deleted = TRUE
        WHERE id = :id
    """,
        nativeQuery = true
    )
    fun deleteMission(id: Int)
}
