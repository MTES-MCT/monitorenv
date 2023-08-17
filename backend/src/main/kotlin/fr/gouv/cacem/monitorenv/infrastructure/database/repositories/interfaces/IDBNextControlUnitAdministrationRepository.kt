package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.ControlUnitAdministrationModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBNextControlUnitAdministrationRepository : CrudRepository<ControlUnitAdministrationModel, Int> {
    @Query(
        value = """
        SELECT *
        FROM control_unit_administrations
        ORDER BY name ASC
        """,
        nativeQuery = true,
    )
    override fun findAll(): List<ControlUnitAdministrationModel>
}
