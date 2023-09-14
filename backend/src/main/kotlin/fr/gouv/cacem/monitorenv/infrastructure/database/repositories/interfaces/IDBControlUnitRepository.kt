package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBControlUnitRepository : CrudRepository<ControlUnitModel, Int> {
    @Modifying(clearAutomatically = true)
    @Query(
        value = """
        UPDATE control_units
        SET archived = TRUE
        WHERE id = :id
        """,
        nativeQuery = true,
    )
    override fun deleteById(id: Int)

    @Query(
        value = """
        SELECT *
        FROM control_units
        ORDER BY name ASC
        """,
        nativeQuery = true,
    )
    override fun findAll(): List<ControlUnitModel>
}
