package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel

import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

interface IDBMissionRepository : CrudRepository<MissionModel, Int> {
  @Query
  fun findAllByOrderByIdAsc(): List<MissionModel>
}
