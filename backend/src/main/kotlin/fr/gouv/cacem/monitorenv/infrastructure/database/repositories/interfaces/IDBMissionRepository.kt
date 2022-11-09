package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.MissionModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBMissionRepository : CrudRepository<MissionModel, Int> {
    @Query
    fun findAllByOrderByInputStartDatetimeUtcDesc(): List<MissionModel>
}
