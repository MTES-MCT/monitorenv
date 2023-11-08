package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.StationModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBStationRepository : CrudRepository<StationModel, Int> {
    @Query(
        value = """
        SELECT *
        FROM bases
        ORDER BY name ASC
        """,
        nativeQuery = true,
    )
    override fun findAll(): List<StationModel>
}
