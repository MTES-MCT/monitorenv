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
  @Query(
    value = """
        SELECT * 
        FROM missions 
        WHERE
            deleted IS FALSE
            AND input_start_datetime_utc >= ?1
            AND input_start_datetime_utc <= ?2
        ORDER BY input_start_datetime_utc DESC
        """,
    nativeQuery = true
  )
  fun findAllMissions(afterDateTime: Instant,
                      beforeDateTime: Instant,
                      pageable: Pageable): List<MissionModel>

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
