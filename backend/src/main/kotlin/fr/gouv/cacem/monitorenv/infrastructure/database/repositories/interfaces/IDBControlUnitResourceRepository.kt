package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitResourceModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBControlUnitResourceRepository : CrudRepository<ControlUnitResourceModel, Int> {
    @Query(
        value = """
        SELECT *
        FROM control_unit_resources
        ORDER BY name ASC
        """,
        nativeQuery = true,
    )
    override fun findAll(): List<ControlUnitResourceModel>
}
