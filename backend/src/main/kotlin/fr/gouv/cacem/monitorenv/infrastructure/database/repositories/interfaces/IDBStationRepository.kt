package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.StationModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query

@DynamicUpdate
interface IDBStationRepository : JpaRepository<StationModel, Int> {
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
