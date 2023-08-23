package fr.gouv.cacem.monitorenv.infrastructure.database.repositories.interfaces

import fr.gouv.cacem.monitorenv.infrastructure.database.model.AdministrationModel
import org.hibernate.annotations.DynamicUpdate
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.CrudRepository

@DynamicUpdate
interface IDBAdministrationRepository : CrudRepository<AdministrationModel, Int> {
    @Query(
        value = """
        SELECT *
        FROM administrations
        ORDER BY name ASC
        """,
        nativeQuery = true,
    )
    override fun findAll(): List<AdministrationModel>
}
