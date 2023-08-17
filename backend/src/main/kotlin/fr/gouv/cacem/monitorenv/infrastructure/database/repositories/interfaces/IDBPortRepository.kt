package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.PortModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBPortRepository : CrudRepository<PortModel, Int> {
    @Query(
        value = """
        SELECT *
        FROM ports
        ORDER BY name ASC
        """,
        nativeQuery = true,
    )
    override fun findAll(): List<PortModel>
}
