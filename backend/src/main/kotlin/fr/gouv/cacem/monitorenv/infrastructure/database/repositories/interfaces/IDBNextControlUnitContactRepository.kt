package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitContactModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBNextControlUnitContactRepository : CrudRepository<ControlUnitContactModel, Int> {
    @Query(
        value = """
        SELECT *
        FROM control_unit_contacts
        ORDER BY name ASC
        """,
        nativeQuery = true,
    )
    override fun findAll(): List<ControlUnitContactModel>
}
