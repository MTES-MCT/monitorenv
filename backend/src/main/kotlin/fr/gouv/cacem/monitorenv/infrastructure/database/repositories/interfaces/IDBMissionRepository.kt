package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Modifying

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBMissionRepository : CrudRepository<MissionModel, Int> {
  @Query(
    value = """
        SELECT * 
        FROM missions 
        WHERE  deleted IS FALSE
        """,
    nativeQuery = true
  )
  fun findAllMissions(): List<MissionModel>

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
