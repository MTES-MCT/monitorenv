package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitContactModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBControlUnitContactRepository : CrudRepository<ControlUnitContactModel, Int> {
    @Modifying(clearAutomatically = true)
    @Query(
        value = """
        DELETE
        FROM control_unit_contacts
        WHERE id = :id
        """,
        nativeQuery = true,
    )
    override fun deleteById(id: Int)

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
