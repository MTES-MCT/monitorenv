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
            AND input_start_datetime_utc >= :startedAfter
            AND (cast(cast(:startedBefore as text) as timestamp) IS NULL OR input_start_datetime_utc <= cast(cast(:startedBefore as text) as timestamp))
            AND (list_to_array(:missionNatures) IS NULL OR mission_nature && list_to_array(:missionNatures))
            AND (list_to_array(:missionTypes) IS NULL OR mission_type = ANY(list_to_array(:missionTypes)))
            AND (list_to_array(:missionStatuses) IS NULL 
                OR (
                    'UPCOMING' = ANY(list_to_array(:missionStatuses)) AND (
                    input_start_datetime_utc >= now()
                    AND closed = false
                    ))
                OR ( 
                    'PENDING' = ANY(list_to_array(:missionStatuses)) AND (
                    (input_end_datetime_utc IS NULL OR input_end_datetime_utc >= now())
                    AND closed = false
                    )
                )
                OR ( 
                    'ENDED' = ANY(list_to_array(:missionStatuses)) AND (
                    input_end_datetime_utc < now() 
                    AND closed = false
                    )
                )
                OR (
                    'CLOSED' = ANY(list_to_array(:missionStatuses)) AND (
                    closed = true
                ))
                
            )
        ORDER BY input_start_datetime_utc DESC
        """,
        nativeQuery = true
    )
    fun findAllMissions(
        startedAfter: Instant,
        startedBefore: Instant?,
        missionNatures: List<String>?,
        missionTypes: List<String>?,
        missionStatuses: List<String>?,
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
